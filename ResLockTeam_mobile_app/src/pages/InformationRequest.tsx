import React, { useCallback, useState, FunctionComponent, useEffect } from "react";
import { View, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import { AntDesign } from '@expo/vector-icons';
import Button from "../components/Button";
import TextField from "../components/TextField";
import createDropDownPropOptions from "../utils/createDropDownProps";
import styleConstants from "../static/styleConstants";
import { Text } from 'react-native-paper';
import { dropDownChange, textInputChange } from "../utils/handleInputChange";
import { DropdownOptionProps, RootStackParamList, UserInfo } from "../types";
import Dropdown from "../components/Dropdown";
import { useAppSelector } from "../redux/hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomWave from "../../assets/bottom-wave.svg";

type InformationRequestProps = NativeStackScreenProps<RootStackParamList, "InformationRequest">
const {width, height} = Dimensions.get("window")

const InformationRequest: FunctionComponent = ({navigation}: InformationRequestProps) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [buildings, setBuildings] = useState<Array<DropdownOptionProps>>([])

    const onTextChange = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => textInputChange(event, setUserInfo), [setUserInfo]);
    const onDropdownChange = useCallback((selectedItem: DropdownOptionProps) => dropDownChange(selectedItem, setUserInfo), [setUserInfo]);
    const org_buildings = useAppSelector((state) => state.organization.organization.buildings);

    const onExit = () => {
        navigation.pop()
    }

    useEffect(() => {
        const transformed = createDropDownPropOptions(org_buildings, "name", "building_id");
        setBuildings(transformed);
    }, [org_buildings]);

    const onSubmit = () => {
        //TODO
    }


    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AntDesign name="arrowleft" size={styleConstants.largeIconSize} color={colors.DARK_GREY} onPress={onExit}/>
                </View>
                <View style={styles.information}>
                    <Text variant="headlineMedium">
                        Request Personal Information Change
                    </Text>
                    <Text>
                        Submitting an information change request will notify your admin.
                        They will either approve or deny the request.
                        All fields are not required.
                    </Text>
                </View>
                <KeyboardAwareScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <View style={styles.input}>
                        <TextField placeholder="First Name" onChange={onTextChange} id="first_name" leftIcon="account"/>
                    </View>
                    <View style={styles.input}>
                        <TextField placeholder="Last Name" onChange={onTextChange} id="last_name" leftIcon="account"/>
                    </View>
                    <View style={styles.input}>
                        <TextField placeholder="Email" onChange={onTextChange} id="email" leftIcon="email-outline"/>
                    </View>
                    <View style={styles.input}>
                        <View style={styles.building}>
                            <View style={styles.dropdown}>
                                <Dropdown options={buildings} leftIcon="building" onSelect={onDropdownChange} defaultText={"Select Building"}/>
                            </View>
                            <TextField placeholder="Room #" onChange={onTextChange} id="room" numeric/>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Button title="Submit Request" onPress={onSubmit}/>
                    </View>
                </View>
                </KeyboardAwareScrollView>
                <BottomWave width={width} height={height/9} style={styles.bottomWave}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    scrollView: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: '6%'
    },
    header: {
        paddingTop: '15%',
    },
    information: {
        paddingTop: '5%',
        paddingBottom: '5%',
        gap: 5
    },
    form: {
        flex: 1,
        height: '100%' 
    },
    building: {
        flexDirection: 'row'
    },
    dropdown: {
        width:'70%', 
    },
    input: {
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    bottomWave: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center'
    },
    button: {
        paddingTop: '10%'
    }
});

export default InformationRequest;