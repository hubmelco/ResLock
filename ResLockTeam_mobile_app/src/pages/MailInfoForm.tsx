import React, { useState, useEffect } from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View, Text, NativeSyntheticEvent, TextInputChangeEventData} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button as IconButton } from "react-native-paper"
import TextField from "../components/TextField";
import { BuildingInfo, CreateDatabaseTypes, RootStackParamList, ErrorMessage, UserInfo } from "../types";
import { textInputChange } from "../utils/handleInputChange"
import Button from "../components/Button";
import colors from "../static/colors";
import Letter from "../../assets/letter.svg"
import Package from "../../assets/package.svg"
import {userService, mailService, buildingService} from "../utils/backendConnection/connection";
import { useAppSelector } from "../redux/hooks";
import styleConstants from "../static/styleConstants";
import ResLockModal from "../components/Modal";
import handleErrors from "../utils/handleErrors";

/**
 * Define the expected props for the page
 */
type MailInformationProps = NativeStackScreenProps<RootStackParamList, "MailInfoForm">;

/**
 * Paage that renders the form that will allow workers to edit package data after it has been scanned
 * 
 * @param route.params: {isLetter: boolean} a boolean should be sent to signify whether the scanned item is a letter or package
 */
const MailInfoForm: FunctionComponent = ({navigation, route}: MailInformationProps) => {

    /**
     * Redux state selector to get the logged in user
     */
    const user = useAppSelector((state) => state.user.user);

    /**
     * Redux state selector to get the buildings of the organization of the user
     */
    const buildings = useAppSelector(state => state.organization.organization.buildings);
    /** 
     * Error handling states
     */
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");
    const [buildingError, setBuildingError] = useState<ErrorMessage>({active: false, message: ""});
    const [userError, setUserError] = useState<ErrorMessage>({active: false, message: ""});

    /**
     * Interface Form Data for the page
     */
   type MailFormData = {
        firstName: string,
        lastName: string,
        address: string,
        roomNumber: number
    }

    /**
     * The form data that will be used to find the user a package is for
     * 
     * Did not use redux here because the data does not need to be globally accessed. Idk if thats valid reason to not use it though
     */
    const [formData, setFormData] = useState<MailFormData>({
        firstName: route.params?.firstName,
        lastName: route.params?.lastName,
        address: route.params?.address,
        roomNumber: route.params?.roomNumber
    });

    /**
     * Function to handle the submission of the form
     */
    const confirm = async () => {
        try {
            // TODO: Update this to compare the addr to the addresses in the buildings array created on line 39 instead of making a server call. Use the most similar one?
            // Reset error messages
            setBuildingError({active: false, message: ""});
            setUserError({active: false, message: ""});
            const [building]: Array<BuildingInfo> = await buildingService.get({"addr": formData.address})
            if (!building) {
                alert("Cannot find this building, please ensure address is entered correctly.")
                throw Error("Building address not found, double check the form data")
            }
            // TODO: may not need the name, if it's a letter could be a nickname which could cause issues
            const [otherUser]: Array<UserInfo> = await userService.get({
                first_name: formData.firstName, // first name from scan
                last_name: formData.lastName, // last name from scan
                building_id: building.building_id, // building id from scan to find the user the package is for
                room: formData.roomNumber, //Users room number from scan
                org_id: user.org_id //This is the workers org (should be in same org)
            })
            if (!otherUser) {
                await Promise.reject({status: 400, error: "Could not find user, double check the form data", type: "user"})
            }
            const body : CreateDatabaseTypes = {
                is_letter: route.params.isLetter,
                email: otherUser.email,
                building_id: user.building_id, //This is the workers building id because the package may not be in the right building
            }
            const response = await mailService.create(body)
            // return to the worker dashboard
            navigation.navigate("Tabs");
        } catch (error) {
            // Default to user information error and update if not
            let errorSetter = setUserError;
            if (error.type == "building") {
                errorSetter = setBuildingError;
            }
            handleErrors(error, setUseModal, setModalText, errorSetter)
        }
    }

    /**
     * Handles updating the state when the text inputs are interacted with
     * 
     * @param event The event from changing the text input
     */
    const inputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        textInputChange(event, setFormData), [setFormData]
    };

    /**
     * Child Component Used to render the title and icon of the form for letters
     */
    const MailHeader: FunctionComponent = () => {
        return (
            <View>
                <Text style={styles.heading}>Mail Information Form</Text>
                <View style={styles.svg}>
                    <Letter height={"100%"} />
                </View>
            </View>
        );
    };

    /**
     * Child Component Used to render the title and icon of the form for packages
     */
    const PackageHeader: FunctionComponent = () => {
        return (
            <View>
                <Text style={styles.heading}>Package Information Form</Text>
                <View style={styles.svg}>
                    <Package height={"100%"} />
                </View>
            </View>
        );
    };

    return (
        <>
            <KeyboardAwareScrollView style={styles.makeWhite}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <IconButton labelStyle={styles.icon} icon="arrow-left" color={colors.MEDIUM_GREY} onPress={() => {navigation.navigate("WorkerDashboard")}}> </IconButton>
                    </View>
                    {route.params.isLetter ? <MailHeader /> : <PackageHeader />}
                    <View style={styles.row}>
                        <TextField id={"firstName"} placeholder={formData.firstName} onChange={inputChange}/>
                        <TextField id={"lastName"} placeholder={formData.lastName} onChange={inputChange}/>
                    </View>
                    <TextField id={"address"} placeholder={formData.address} onChange={inputChange}/>
                    {buildingError.active ? <Text style={styles.error}>{buildingError.message}</Text> : null}
                    <TextField id={"roomNumber"} placeholder={""+formData.roomNumber} onChange={inputChange} numeric={true}/>
                    {userError.active ? <Text style={styles.error}>{userError.message}</Text> : null}
                    <Button title={"Confirm"} onPress={confirm} type={"Primary"}/>
                </View>
            </KeyboardAwareScrollView>   
            {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null}
        </>
    );
};

const styles = StyleSheet.create({
    makeWhite: {
        backgroundColor: "#FFFFFF"
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    heading: {
        fontSize: styleConstants.subheaderFontSize,
        width: "95%",
        alignSelf: "center",
        paddingBottom: "10%",
        paddingTop: "10%",
        fontWeight: "bold",
    },
    svg: {
        alignItems: "center",
        height: "50%"
    },
    icon: {
        fontSize: styleConstants.largeIconSize
    },
    iconContainer: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: 'row',
        width:'100%',
        paddingTop: "10%",
    },
    error: {
        color: colors.ERROR,
        fontSize: styleConstants.textFontSize,
    },
});

export default MailInfoForm;