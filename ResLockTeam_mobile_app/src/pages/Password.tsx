import React, { FunctionComponent, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LoginInfo, RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import Lock from "../../assets/lock.svg";
import { AntDesign } from '@expo/vector-icons';
import Button from "../components/Button";
import TextField from "../components/TextField";
import app from "../utils/backendConnection/connection";
import { useAppDispatch } from "../redux/hooks";
import { updateUser } from "../redux/reducers/currentUserSlice";
import styleConstants from "../static/styleConstants";
import ResLockModal from "../components/Modal";

type Password = NativeStackScreenProps<RootStackParamList, "Password">

const Password: FunctionComponent = ({navigation, route}: Password) => {

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const dispatch = useAppDispatch();

    const onExit = () => {
        navigation.pop()
    }

    const onContinue = async () => {
        // TODO verify matching passwords
        try {
            // TODO UPDATE USER

            // Auto-login user
            const user = await app.login({email: route?.params.email, password: password} as LoginInfo);
            dispatch(updateUser(user));

            // TODO: can combine the dashboards with a control component or navigate to the
            // correct one based on the users privilege level uusing if statements
            navigation.navigate("ResidentDashboard");
        } catch (error) {
            console.log(error);
            return (
                <ResLockModal error text={error.message}/>
            )
        }
    }

    return (
        <ScrollView scrollEnabled={false} style={styles.screen} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.view}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={onExit}>
                        <AntDesign name="arrowleft" size={40} color={colors.MEDIUM_GREY} />
                    </TouchableOpacity>
                </View>
                <View style={styles.image}>
                    <Lock height={"70%"}/>
                </View>
                <Text style={styles.text}>
                    Please enter a new password
                </Text>
                <View>
                    <Text>
                        New Password*
                    </Text>
                    <TextField id={'password'} onChange={e => {setPassword(e.nativeEvent.text)}} secureTextEntry/>
                </View>
                <View>
                    <Text>
                        Confirm Password*
                    </Text>
                    <TextField id={'confirmPassword'} onChange={e => {setConfirmPassword(e.nativeEvent.text)}} secureTextEntry/>
                </View>
                <View style={styles.continue}>
                    <View style={styles.button}>
                        <Button title={"Continue"} onPress={onContinue} disabled={password.length === 0 || password !== confirmPassword}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingTop: '10%',
        padding: '5%',
    },
    backButton: {
        paddingBottom: '10%'
    },
    image: {
        alignItems: 'center',
        height: 200
    },
    text: {
        fontSize: styleConstants.subheaderFontSize,
        paddingTop: "5%",
        paddingBottom: '30%',
        alignSelf: 'center'
    },
    continue: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: '20%'
    },
    view: {
        flex: 1
    },
    button: {
        height: 10
    }
});

export default Password;