import React, { FunctionComponent, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DropdownOptionProps, RootStackParamList, UserInfo } from "../types";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateImage} from "../redux/reducers/workerCameraSlice";
import app from "../utils/backendConnection/connection"
import ResLockModal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import Footer from "../components/Footer";
import colors from "../static/colors";
import privileges from "../static/privilege";
import AccessDenied from "./AccessDenied";
import Button from "../components/Button";
import createDropDownPropOptions from "../utils/createDropDownProps";
import handleErrors from "../utils/handleErrors";

type WorkerCameraProps = NativeStackScreenProps<RootStackParamList, "WorkerDashboard">

const WorkerCamera: FunctionComponent = ({navigation}: WorkerCameraProps) => {
    const user = useAppSelector((state) => state.user.user);
    const org_buildings = useAppSelector(state => state.organization.organization.buildings);

    if(user.privilege > privileges.WORKER) {
        return <AccessDenied/>
    }

    // TODO couldn't figure out how to do this with redux. It looks like a custom useState I think.
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [buildings, setBuildings] = useState<Array<DropdownOptionProps>>([]);
    const [location, setLocation] = useState<number>();
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    useEffect(() => {
        const transformed = createDropDownPropOptions(org_buildings, "name", "building_id");
        setBuildings(transformed);
    }, [org_buildings]);

    const cameraRef = useRef();

    // redux stuff
    const image = useAppSelector((state) => state.workerCamera.image);
    const dispatch = useAppDispatch();
    // figure out redux to get userInfo from currentUserSlice
    // const user = getUser(userInfo);
    // const org_id = user.org_id;

    const onDropdownChange = (selectedItem: {name: string, value: number}) => {
        setLocation(selectedItem.value)
    }

    //TODO needs to be tested. idk how, I never got a permission prompt when running this page
    if (!permission) {
        // Camera permissions are still loading
        // TODO maybe change to loading?
        return <View />;
    }

    //TODO needs to be tested, same as above
    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to use your camera
                </Text>
                <Button onPress={requestPermission} title="Allow Reslock to access your camera" />
            </View>
        );
    }

    //to go back to worker dashboard
    const backToDash = () => {
        navigation.navigate("Tabs");
    }

    const takePhoto = async () => {
        if (!cameraRef.current) {
            return;
        }
        const options = {
            quality: 1,
            exif: false,
            base64:true
        }
        //@ts-ignore I don't know how to fix the ref being type 'never' instead of Camera
        const newPhoto: CameraCapturedPicture = await cameraRef.current.takePictureAsync(options);
        dispatch(updateImage(newPhoto));
    }

    const parseAddressInfo = async (textData) => {
        const results = textData.readResult.pages[0].lines;
        let fullName;
        let isLetter;
        if(results[0].content.toLowerCase().includes("to:")) {
            const name = results[0].content.replace("to:", ("") );   
            fullName = name.split(" ");
            isLetter = true;
        } else {
            fullName = results[0].content.split(" ");
            isLetter = false;
        }

        const lastName = fullName[1];
        const firstName = fullName[0];

        const splitText = " unit ";
        let fullAddr;
        if(results[1].content.split( new RegExp(splitText, 'i') )){
            fullAddr = results[1].content.split( new RegExp(splitText, 'i') );
        } else if(results[2].content.split( new RegExp(splitText, 'i') )) {
            fullAddr = results[2].content.split( new RegExp(splitText, 'i') );
        }
        const addr = fullAddr[0];
        const room = parseInt(fullAddr[1]);

        console.log("First Name: ", firstName);
        console.log("Last Name: ", lastName);
        console.log("Building Address: ", addr);
        console.log("Room #: ", room);

        const data = [firstName, lastName, addr, room, isLetter];
        return data;
    }

    if (image) {
        // Sends the image to the backend to get text in image
         const uploadImage = async () => {
            try {
                const formData: FormData = new FormData();

                //Creates the form data that the backend needs
                formData.append("profile", {
                    //@ts-ignore I don't know why this is yelling
                    name: `${new Date()}_profile`, //probably not needed
                    uri: image.uri, // this is the image data
                    type: "image/jpeg", // this is needed to filter the image file from other files that arent accepted
                });

                const res = await app.readImageText(formData);
                // TODO maybe redirect to a form or something thata'll autopopulate data. Maybe add a reducer for the data to be used elsewhere.
                // Also still have to parse the data thats returned
                // This should be the data returned from the microsoft OCR API

                const parsedData = await parseAddressInfo(res);
                navigation.navigate("MailInfoForm", {isLetter: parsedData[4], firstName: parsedData[0], lastName: parsedData[1], address: parsedData[2], roomNumber: parsedData[3]});
            } catch (error) {
                handleErrors(error, setUseModal, setModalText);
            }
        }

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + image.base64 }}/>
                <Button title="Upload" onPress={uploadImage}/>
                <Button title="Discard" onPress={() => dispatch(updateImage(undefined))} />
                {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null }
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.inlineStyle}>
                        <View style={styles.dropdown}>
                            <Dropdown options={buildings} onSelect={onDropdownChange} defaultText={"Select Location"}/>
                        </View>
                </View>
                <View style={styles.workerCameraContainer}>
                    <Camera style={styles.workerCamera} type={CameraType.back} ref={cameraRef}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={backToDash} type={"Primary"} title="Go Back"/>
                    <Text>   </Text>
                    <Button onPress={takePhoto} type={"Primary"} title="Take Photo"/>
                </View>
            </View>
            <Footer dashboardType="Worker" navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        width:'80%',
    },
    inlineStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingTop: '15%',
    },
    container: {
        flex: 1,
        alignItems: "center",
    },
    workerCameraContainer: {
        alignItems: 'center',
        borderWidth: 20,
        borderColor: colors.BLACK,
        borderRadius: 10,
        margin: 30,
    },
    workerCamera: {
        height: 470,
        width: 300,
    },
    buttonContainer: {
        // flex: 1,
        flexDirection: "row",
        paddingHorizontal: 32,
        justifyContent: "space-between",
    },
    preview: {
        alignSelf: "stretch",
        flex: 1,
    },
});

export default WorkerCamera;
