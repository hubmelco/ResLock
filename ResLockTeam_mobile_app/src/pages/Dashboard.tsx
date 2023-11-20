import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View, Dimensions, FlatList } from "react-native";
import MailPieceDisplay from "../components/MailPieceDisplay";
import Button from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BuildingInfo, ErrorMessage, MailInfo, RootStackParamList } from "../types";
import colors from "../static/colors";
import { useAppSelector } from "../redux/hooks";
import Svg from "react-native-svg";
import EmptyInbox from '../../assets/empty-mailbox.svg';
import QRCode from "react-qr-code";
import { Divider, Text } from 'react-native-paper';
import styleConstants from "../static/styleConstants";
import { buildingService } from "../utils/backendConnection/connection";
import handleErrors from "../utils/handleErrors";
import ResLockModal from "../components/Modal";


type ResidentDasboardProps = NativeStackScreenProps<RootStackParamList, "ResidentDashboard">;
const {width, height} = Dimensions.get("window")

const ResidentDashboard: FunctionComponent = ({navigation, route}: ResidentDasboardProps) => {

    const user = useAppSelector((state) => state.user?.user);
    const org = useAppSelector((state) => state.organization?.organization);


    const [buildingName, setBuildingName] = useState<string>("");
    const [error, setError] = useState<ErrorMessage>({active: false, message:""});
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    useEffect(() => {
        const getBuilding = async () => {
            return await buildingService.get(user.building_id);
        }
        getBuilding()
            .then(([building]) => {
                setBuildingName(building.name);
            }).catch((err) => {
                handleErrors(err, setUseModal, setModalText);
                if (err.status >= 400 && err.status < 500) {
                    // Should never be reached because all users should have a building_id, but just in case, override the server error
                    setError({ active: true, message: `Not registered under a building at ${org.name}. Please message your admin if this is a mistake` });
                    // TODO this error looks pretty bad, try to improve
                }
            });
    }, [user])

    const renderItemComponent = (itemData: MailInfo) => {
        return <MailPieceDisplay building_id={itemData.building_id} date={itemData.date_received} isLetter={itemData.is_letter}/>
    }

    const onViewAllPackages = () => {
        navigation.navigate("AllPackages")
    }

    const currentMail = user.mail.filter((mailPiece) => mailPiece.date_picked_up === null)

    return (
        <>
        <View style={styles.QRCode}>
            <View style={styles.QROutline}>
                <View style={styles.QRHeader}>
                    <Text variant="titleMedium">
                        Scan To Check Out Packages
                    </Text>
                </View>
                <QRCode size={175} value={`${user.email},${buildingName}`}/>
                {error.active ? <Text style={styles.error}>{error.message}</Text> : null}
            </View>
        </View>
        <View style={styles.row}>
            <Text variant="headlineSmall">
                Your Packages
            </Text>
            <View>
                <Button isLink title="View Older" onPress={onViewAllPackages}/>
            </View>
        </View>
        <Divider/>
        {(currentMail.length == 0 ? 
            <View style={styles.emptyView}>
                <Svg width={"50%"} height={"50%"} viewBox={`0 0 207 192`}>
                    <EmptyInbox/>
                </Svg>
                <Text>
                    You Currently Have No Mail!
                </Text>
            </View>
            :
            <View style={styles.itemList}>
                <View>
                    <FlatList data={currentMail} renderItem={item => renderItemComponent(item.item)} ItemSeparatorComponent={() => <View style={{height: 30}}/>}/>  
                </View>
            </View>
        )}
        {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null}
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: "column",
        resizeMode: "stretch",
        alignItems: "center",
    },
    QRCode: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.WHITE,
        height: "45%",
    },
    QROutline: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.LIGHT_GREY,
        padding: "4%",
        borderRadius: styleConstants.smallBorderRadius,
    },
    QRHeader: {
        alignContent: "center",
        alignItems: "center",
        paddingBottom: "5%",
    },
    itemList: {
        flex: 1,
        flexDirection: "column",
        resizeMode: "stretch",
        alignItems: "center",
        backgroundColor: colors.WHITE,
        paddingTop: "5%",
    },
    svg: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        height: height / 4,
    },
    emptyView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.WHITE,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.WHITE,
        padding: "5%",
    },
    error: {
        fontSize: styleConstants.textFontSize,
        color: colors.ERROR,
    },
});

export default ResidentDashboard;