import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { mailService, userService } from "../utils/backendConnection/connection";
import colors from "../static/colors";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styleConstants from "../static/styleConstants";
import ResLockModal from "../components/Modal";
import { useAppSelector } from "../redux/hooks";
import AccessDenied from "./AccessDenied";
import privileges from "../static/privilege";
import handleErrors from "../utils/handleErrors";
import BarcodeMask from "react-native-barcode-mask";
import Button from "../components/Button";
import { Svg } from "react-native-svg";
import CameraImage from "../../assets/camera.svg";
import { Text } from "react-native-paper";


type WorkerQRCodeProps = NativeStackScreenProps<RootStackParamList, "WorkerQRCode">
const {width, height} = Dimensions.get("window")

const WorkerQRCode: FunctionComponent = ({navigation}: WorkerQRCodeProps) => {
    const user = useAppSelector((state) => state.user.user);

    if(user.privilege > privileges.WORKER) {
        return <AccessDenied/>
    }
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            return status
        };

        getBarCodeScannerPermissions()
            .then((status) => {
                setHasPermission(status === 'granted');
            })
    }, []);

    const handleBarCodeScanned = async ({ data }: BarCodeScannerResult) => {
        setScanned(true);
        const dataArray = data.split(",");
        const residentEmail = dataArray[0];
        const buildingName = dataArray[1];
        try {
            //TODO: Add building param to mail query when chloe stuff is merged
            const [mail, [resident]] = await Promise.all([mailService.get({ email: residentEmail }), userService.get(residentEmail)]);
            navigation.navigate("WorkerCheckout", {mail: mail, resident: {name: `${resident.first_name} ${resident.last_name}`, building: buildingName, room: resident.room}});
        } catch (error) {
            // TODO: (maybe) add a red error message (Text in jsx) for non server errors 
            handleErrors(error, setUseModal, setModalText)
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <View style={styles.svg}>
                <Svg width={"100%"} height={"80%"} viewBox={`0 0 575 412`}>
                    <CameraImage/>
                </Svg> 
                </View>
                <Text variant="titleLarge" style={styles.centerText}>
                    Cannot Access Camera!
                </Text>
                <Text variant="labelLarge" style={styles.centerText}>
                    Please Allow Access in Your Settings
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.workerQRCode}>         
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.barCodeScanner}
                >
                    <BarcodeMask edgeColor={colors.DARK_ORANGE} showAnimatedLine width={width*.7}/>
                </BarCodeScanner>
                <View style={styles.button}>
                    {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
                </View>
            </View>
            {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    workerQRCode: {
        flex: 1,
        margin: "10%",
        justifyContent: 'center',
        alignContent: 'center',
        height: "60%",
    },
    barCodeScanner: {
        flex: 1,
        width: width*.9,
    },
    button: {
        marginTop: '5%',
        height: styleConstants.inputMinHeight
    },
    centerText: {
        textAlign: 'center'
    },
    svg: {
        justifyContent: 'center',
        alignContent: 'center',
        height: height/5,
        marginTop: '40%'
    },
});

export default WorkerQRCode;