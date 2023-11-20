import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity} from "react-native";
import colors from "../static/colors";
import fonts from "../static/styleConstants"
import * as Google from 'expo-auth-session/providers/google';
import environment from "../../config";
import {updateUser} from "../redux/reducers/currentUserSlice";
import { useAppDispatch } from "../redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styleConstants from "../static/styleConstants";


const GoogleButton = ({navigation}) => {

    const dispatch = useAppDispatch();

    //TODO: This blasts the console with text please fix. Also breaks tests so commenting out until someone fixes
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     shouldAutoExchangeCode: false,
    //     responseType: 'code',
    //     clientId: "872790068239-cocq1mmqed4c09p8kp3ckg1bgllqnu62.apps.googleusercontent.com", 
    //     webClientId: "872790068239-cocq1mmqed4c09p8kp3ckg1bgllqnu62.apps.googleusercontent.com",
    //     expoClientId: "872790068239-cocq1mmqed4c09p8kp3ckg1bgllqnu62.apps.googleusercontent.com",
    //     iosClientId: "872790068239-qrd9ltksh31gr7ggis44nlhecphoouo8.apps.googleusercontent.com",
    //     androidClientId: "872790068239-4rcao55aspkac37ibuf75f5i3i2s9uc1.apps.googleusercontent.com"
    // });

    // const onSignIn = async (res) => {
    //     switch(res.status) {
    //         // account verified with google and reslock
    //         case 200:
    //             let result = await res.json()
    //             dispatch(updateUser(result))
    //             await AsyncStorage.setItem("session", result.token);
    //             navigation.navigate("ResidentDashboard")
    //             break;
    //         // account verified with google but not reslock
    //         case 300:
    //             let googleUser = await res.json()
    //             console.log(JSON.stringify(googleUser))
    //             // redirect to create account page
    //             navigation.navigate("CreateAccount")
    //             break;
    //         // account not verified with google
    //         case 401:
    //             // TODO display error message
    //             break;
    //     }

    // }

    // useEffect(() => {
    //     if (response?.type === "success") {

    //         let authCode = response.params.code

    //         // TODO make this into a frontend service
    //         fetch(`${environment.APIEndpoint}/google?authCode=${encodeURIComponent(authCode)}&codeVerifier=${request.codeVerifier}`)
    //         .then(response => onSignIn(response))
    //     }

    //     // TODO error message

    // }, [response])

    return (
//promptAsync shouldn't be in quotes        
<TouchableOpacity style={styles.button} onPress={() => "promptAsync()"}>

            <Text style={styles.text}>Google</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: styleConstants.largeBorderRadius,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        minHeight: 40,
        backgroundColor: colors.GOOGLE,
    },
    text: {
        color: colors.WHITE,
        fontSize: fonts.textFontSize
    }
});

export default GoogleButton;
