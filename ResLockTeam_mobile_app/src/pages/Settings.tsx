import React, { FunctionComponent, useCallback, useState } from "react";
import { View, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, Keyboard } from "react-native";
import { RootStackParamList} from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import { AntDesign } from '@expo/vector-icons';
import { useAppSelector } from "../redux/hooks";
import { textInputChange } from "../utils/handleInputChange";
import styleConstants from "../static/styleConstants";
import { Avatar, Text } from 'react-native-paper';
import TextField from "../components/TextField";
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { userService } from "../utils/backendConnection/connection";
import ResLockModal from "../components/Modal";
import handleErrors from "../utils/handleErrors";

type SettingsProps = NativeStackScreenProps<RootStackParamList, "Settings">

const Settings: FunctionComponent = ({navigation}: SettingsProps) => {

    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [savePassword, setSavePassword] = useState<boolean>(false);
    const onPasswordChange = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => textInputChange(event, setPassword), [setPassword]);

    const user = useAppSelector((state) => state.user.user);

    const onExit = () => {
        navigation.pop();
    }

    const onChangePassword = () => {
        try {
            userService.update(user.email, {"password" : password});
            Keyboard.dismiss();
        } catch (error) {
            <ResLockModal error text={error.message}/>
        }
    }

    const onChangeEmailNotification = (subscribed: boolean) => {
        try {
            userService.update(user.email, {"email_notif" : subscribed});
        } catch (error) {
            handleErrors(error, setUseModal, setModalText);
        }
    }

    const onChangePushNotification = (subscribed: boolean) => {
        try {
            userService.update(user.email, {"push_notif" : subscribed});
        } catch (error) {
            handleErrors(error, setUseModal, setModalText);
        }    
    }

    return (
        <>
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AntDesign name="arrowleft" size={styleConstants.largeIconSize} color={colors.DARK_GREY} onPress={onExit}/>
                </View>
                <View style={styles.accountInfo}>
                    <Avatar.Text size={styleConstants.xlIconSize} label={user.first_name[0] + user.last_name[0]} style={{backgroundColor: colors.LIGHT_BLUE}}/>
                    <Text variant="headlineMedium">
                        {user.first_name + " " + user.last_name} 
                    </Text>
                    <Text variant="headlineSmall">
                        Building Name
                    </Text>
                    <Text variant="headlineSmall">
                        {user.room}
                    </Text>
                    <View style={styles.button}>
                        <Button title={"Change Personal Information"} onPress={() => {navigation.navigate("InformationRequest")}}/>
                    </View>
                </View>
                <View style={styles.securitySection}>
                    <View style={styles.inputHeader}>
                        <Text variant="headlineSmall">
                            Security
                        </Text>
                    </View>
                    <View style={styles.passwordField}>
                        <TextField 
                            id="password" 
                            onChange={onPasswordChange} 
                            onFocus={() => setSavePassword(true)}
                            onBlur={() => setSavePassword(false)}
                            leftIcon="lock" 
                            placeholder="Change Password"
                            secureTextEntry
                        />
                        <View>
                            {savePassword &&
                                <Feather name="check" size={styleConstants.mediumIconSize} color={colors.DARK_ORANGE} onPress={onChangePassword}/>
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.notificationSection}>
                    <View style={styles.inputHeader}>
                        <Text variant="headlineSmall">
                            Notifications
                        </Text>
                    </View>
                    <View style={styles.inputs}>
                        <View style={styles.toggleRow}>
                            <View style={styles.rowContent}> 
                                <View style={styles.text}>
                                    <Fontisto name="email" size={styleConstants.mediumIconSize} color={colors.DARK_GREY}/>
                                    <Text style={styles.text} variant="labelMedium">
                                        Email
                                    </Text>
                                </View>
                                <Toggle onPress={onChangeEmailNotification}/>
                            </View>
                        </View>
                        <View style={styles.toggleRow}>
                            <View style={styles.rowContent}>
                                <View style={styles.text}>
                                    <FontAwesome5 name="bell" size={styleConstants.mediumIconSize} color={colors.DARK_GREY} />
                                    <Text style={styles.text} variant="labelMedium">
                                        Push
                                    </Text>
                                </View>
                                <Toggle onPress={onChangePushNotification}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null}
        </>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    container: {
        flex: 1,
        padding: '6%'
    },
    header: {
        paddingTop: '15%',
    },
    accountInfo: {
        paddingTop: '5%',
        alignItems: 'center',
        height: "40%",
    },
    notificationSection: {
        height: "25%"
    },
    securitySection: {
        height: "20%"
    },
    inputHeader: {
        paddingBottom: '5%'
    }, 
    passwordField: {
        height: "50%",
        flexDirection: 'row'
    },
    inputs: {
        height: "50%",
    },
    toggleRow: {
        borderBottomColor: colors.MEDIUM_GREY,
        borderBottomWidth: 1,
    },
    rowContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        paddingBottom: '2%'
    },
    text: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        fontSize: styleConstants.textFontSize,
        alignItems: 'center'
    },
    button: {
        height: styleConstants.inputMinHeight,
        width: '80%',
        marginTop: '10%'
    }
});

export default Settings;