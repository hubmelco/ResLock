import React, { FunctionComponent, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import { Ionicons, Entypo } from '@expo/vector-icons';
import app from "../utils/backendConnection/connection"
import styleConstants from "../static/styleConstants";
import ResLockModal from "../components/Modal";
import handleErrors from "../utils/handleErrors";

type HamburgerMenuProps = NativeStackScreenProps<RootStackParamList, "Settings">

const HamburgerMenu: FunctionComponent = ({navigation}: HamburgerMenuProps) => {

    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    const navigateSettings = () => {
        navigation.navigate('Settings');
    }

    const logout = async () => {
        try {
            await app.logout()
            navigation.navigate("Login")
        } catch(error) {
            handleErrors(error, setUseModal, setModalText);
        }
    }

    const closeMenu = () => {
        navigation.pop()
    }

    return (
        <>
            <View style={styles.screen}>
                <View style={styles.exit}>
                    <Entypo name="cross" size={styleConstants.largeIconSize} color="white" onPress={closeMenu}/>
                </View>
                <View style={styles.options}>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={navigateSettings}>
                            <Ionicons name="settings-sharp" size={styleConstants.mediumIconSize} color="white" />
                            <Text style={styles.text}>
                                Settings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="help-circle" size={styleConstants.mediumIconSize} color="white" />                    
                            <Text style={styles.text}>
                                Help
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Ionicons name="exit-outline" size={styleConstants.mediumIconSize} color="white" />
                        <Text style={styles.text}>
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {useModal ? <ResLockModal error text={modalText} setIsVisible={setUseModal}/> : null}
        </>
    )
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.DARK_BLUE,
    },
    button: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        height: "20%",
        paddingLeft: "10%"
    },
    text: {
        color: colors.WHITE,
        paddingLeft: "5%",
        fontSize: styleConstants.subheaderFontSize
    },
    options: {
        paddingTop: "5%",
        justifyContent: "space-between",
        flex: 1,
        paddingBottom: "5%"
    },
    exit: {
        paddingTop: "20%",
        paddingRight: "10%",
        justifyContent: 'flex-end',
        flexDirection: "row",
    }
});


export default HamburgerMenu;