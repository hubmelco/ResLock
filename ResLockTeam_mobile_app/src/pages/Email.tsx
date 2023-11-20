import { FunctionComponent, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import EmailImage from "../../assets/email.svg";
import { AntDesign } from '@expo/vector-icons';
import Button from "../components/Button";
import TextField from "../components/TextField";
import app from "../utils/backendConnection/connection";
import styleConstants from "../static/styleConstants";
import ResLockModal from "../components/Modal";

type EmailProps = NativeStackScreenProps<RootStackParamList, "OTP">

const Email: FunctionComponent = ({navigation, route}: EmailProps) => {

    const [email, setEmail] = useState<string>("");

    const onExit = () => {
        navigation.pop()
    }

    const onContinue = () => {
        try {
            app.sendVerificationCodeToEmail(email);
            navigation.navigate('OTP', {org_id: route.params.org_id, email: email})
        } catch (error) {
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
                        <AntDesign name="arrowleft" size={styleConstants.largeIconSize} color={colors.MEDIUM_GREY} />
                    </TouchableOpacity>
                </View>
                <View style={styles.image}>
                    <EmailImage height={"100%"}/>
                </View>
                <Text style={styles.text}>
                    Please enter your email associated with your organization
                </Text>
                <View>
                    <TextField id={'email'} onChange={e => {setEmail(e.nativeEvent.text)}} email/>
                </View>
                <View style={styles.continue}>
                    <View>
                        <Button title={"Continue"} onPress={onContinue} disabled={email.length === 0}/>
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
        paddingTop: '15%',
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
        paddingTop: "20%",
        paddingBottom: '10%'
    },
    continue: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: '10%'
    },
    view: {
        flex: 1
    },
});

export default Email;