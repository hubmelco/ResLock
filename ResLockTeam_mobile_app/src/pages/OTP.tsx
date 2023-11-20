import React, { FunctionComponent, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { emailVerificationInfo, RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import OTPTextView from 'react-native-otp-textinput';
import PasswordImage from "../../assets/otp-image.svg";
import { AntDesign } from '@expo/vector-icons';
import Button from "../components/Button";
import app from "../utils/backendConnection/connection";

type OTPProps = NativeStackScreenProps<RootStackParamList, "OTP">

const OTP: FunctionComponent = ({navigation, route}: OTPProps) => {

    const [otp, setOtp] = useState<string>("");

    const onExit = () => {
        navigation.pop()
    }

    const onResendCode = () => {
        
    }

    const onVerify = async () => {
        try {
            const res = await app.verifyEmailCode({email: route.params.email, otp: Number(otp)} as emailVerificationInfo);
            if (!res.verified) {
                // ERROR HANDLING - throw one?
                return;
            } 
            navigation.navigate("Password", {email: route.params.email, jwt: res.token})
        } catch (error) {
            // TODO update error popup
            console.log(error)
        }
    }

    const hiddenEmail = () => {
        const email = route.params.email
        const [name, domain] = email.split('@')
        return `${name[0]}${new Array(name.length).join('*')}@${domain}`; 
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
                    <PasswordImage height={"100%"}/>
                </View>
                <Text style={styles.text}>
                    Enter the six-digit code sent to <>{hiddenEmail()}</>
                </Text>
                <View style={styles.OTPContainer}>
                  <OTPTextView 
                    containerStyle={styles.textInputContainer}
                    textInputStyle={styles.roundedTextInput}
                    inputCount={6}
                    tintColor={colors.DARK_ORANGE}
                    handleTextChange={e => {setOtp(e)}}
                    />  
                </View>
                <View style={styles.resend}>
                    <Text>
                        Didn't receive a code?
                    </Text>
                    <View style={styles.resendButton}>
                        <Button title={"Resend Code"} onPress={onResendCode} isLink/>
                    </View>
                </View>
                <View style={styles.continue}>
                    <View>
                        <Button title={"Continue"} onPress={onVerify} disabled={otp.length !== 6}/>
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
        fontSize: 20,
        paddingTop: "10%"
    },
    OTPContainer: {
        paddingTop: '15%',
        alignItems: 'center'
    },
    textInputContainer: {
        marginBottom: 20
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4
    },
    resend: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '5%'
    },
    resendButton: {
        paddingLeft: 5
    },
    continue: {
        flex: 1,
        paddingTop: '50%',
        height: '100%',
        alignContent: 'flex-end',
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

export default OTP;