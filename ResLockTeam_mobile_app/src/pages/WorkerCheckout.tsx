import React, { FunctionComponent, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";

import { RootStackParamList, ErrorMessage } from "../types";
import Button from "../components/Button";
import {mailService} from "../utils/backendConnection/connection";
import ResLockModal from "../components/Modal";
import handleErrors from "../utils/handleErrors";
import colors from "../static/colors";
import styleConstants from "../static/styleConstants";

type CheckoutProps = NativeStackScreenProps<RootStackParamList, "WorkerCheckout">;

/**
 * This page defines the style and functionality of the scanning out process for workers
 */
const WorkerCheckout: FunctionComponent = ({navigation, route}: CheckoutProps) => {

    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");
    const [error, setError] = useState<ErrorMessage>({active: false, message:""});

    /**
     * Handles when to disable and enable the checkout button. If there are no items selected, it is disabled
     */
    useEffect(() => {
        setIsDisabled(selectedItems.size === 0);
    }, [selectedItems]);

    /**
     * When the checkout button is pressed, send an update query for each mail item selected
     */
    const submit = async () => {
        const queryArray = []
        // Add all the promises into an array to do them all at once later. 
        // Gets rid of concurrency issues when trying to navigate back to the previous screen (Always navigated back first)
        selectedItems.forEach((id) => {
            queryArray.push(mailService.update(id, {date_picked_up: new Date()}));
        })
        try {
            // TODO: This results in a server error because we cant send dates. Maybe add a succeeded page for clarity?
            await Promise.all(queryArray);
            // Return to qr scanning screen after checking out mail
            navigation.pop();
        } catch (error) { 
            handleErrors(error, setUseModal, setModalText, setError);
        }
    }

    /**
     * When the back arrow is pressed, return to the QR scanning page
     */
    const onExit = () => {
        navigation.pop();
    }

    return (
        <View style={styles.body}>
            <View style={styles.header}>
                <AntDesign name="arrowleft" size={styleConstants.largeIconSize} color={colors.DARK_GREY} onPress={onExit}/>
            </View>
            <View style={styles.residentInfo}>
                <Text style={styles.text}>{route.params.resident.name}</Text>
                <Text style={styles.subText}>{route.params.resident.building}</Text>
                <Text style={styles.subText}>Room {route.params.resident.room}</Text>
            </View>
            <View>
                <View style={styles.separator}>
                    <Text style={[styles.emphasized, styles.subText]}>Mail Selection</Text>
                    {error.active ? <Text style={[styles.error]}>{error.message}</Text> : null} 
                </View>
                <ScrollView style={styles.mailSelection}>
                    {
                        route.params?.mail?.length == 0 && 
                        <View style={styles.center}>
                            <AntDesign name="infocirlceo" style={styles.text} color={colors.LIGHT_BLUE}/>
                            <Text style={styles.subText}>Resident has no mail</Text>
                            <Text style={styles.subText}>available at this building</Text>
                        </View>
                    }
                    {route.params.mail.map((mail) => {
                        // Get rid of the year and replace - with /
                        const date = mail.date_received.split("T")[0].replace(/(\d){4}-/, "").replace("-", "/");
                        // TODO there's a typescript error here regarding props that I don't know how to fix
                        return <MailItem key={mail.mail_id} date={date} isLetter={mail.is_letter} id={mail.mail_id} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
                    })}
                </ScrollView>
            </View>
            <View style={[StyleSheet.absoluteFillObject, styles.bottom]}>
                <Button title="Checkout" onPress={submit} disabled={isDisabled}/>
            </View>
            {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null}
        </View>
    );
}

/**
 * Component that defines how the mail items should look
 * (Can maybe move to components folder, but I don't think it will be used anywhere else)
 */
const MailItem: FunctionComponent = ({date, isLetter, id, selectedItems, setSelectedItems}: {date: string, isLetter: boolean, id: number, selectedItems: Set<number>, setSelectedItems:React.Dispatch<React.SetStateAction<Set<number>>>}) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    /**
     * Updates the parent selectedItems set
     */
    useEffect(() => {
        if (isSelected) {
            selectedItems.add(id);
        } else {
            selectedItems.delete(id);
        }
        setSelectedItems(new Set(selectedItems));
    }, [isSelected])

    /**
     * Toggles the checkbox between checked and unchecked
     */
    const toggle = () => {
        setIsSelected(!isSelected);
    }

    return (
        <View style={[styles.mailItem, styles.separator]}>
            {isLetter ? <Ionicons name={"mail-open-outline"} size={styleConstants.largeIconSize}/> : <MaterialCommunityIcons style={styles.cube} name="package-variant" size={styleConstants.largeIconSize + 2}/>}
            <Text style={[styles.subText]}>{date}</Text>
            {/* android is on purpose cause iOS has bad checkboxes */}
            <Checkbox.Item label={""} mode="android" status={isSelected ? "checked" : "unchecked"} onPress={toggle} color={colors.DARK_ORANGE} uncheckedColor={colors.DARK_ORANGE} style={styles.checkbox}/>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        padding: 10,
        height: "100%",
    },
    emphasized: {
        fontWeight: "bold",
    },
    center: {
        flex:1,
        justifyContent:"center",
        alignItems: "center",
        marginTop: 20,
    },
    separator: {
        borderBottomColor: colors.MEDIUM_GREY,
        borderBottomWidth: 1,
    },
    residentInfo: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "35%",
    },
    mailSelection: {
        height: "65%",
    },
    header: {
        paddingTop: "15%",
    },
    mailItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: styleConstants.headerFontSize,
        color: colors.DARK_BLUE,
    },
    subText: {
        fontSize: styleConstants.textFontSize + 5,
        color: colors.DARK_BLUE,
    },
    bottom: {
        // Using max height to allows button to scale down, but never get bigger. Might look wonky on very small devices though
        maxHeight: styleConstants.inputMinHeight,
        top: "90%",
        paddingLeft: 10,
        paddingRight: 10,
    },
    error: {
        color: colors.ERROR,
    },
});

export default WorkerCheckout;