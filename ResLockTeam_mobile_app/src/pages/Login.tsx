import React, { FunctionComponent, useCallback, useState } from "react";
import {StyleSheet, Text, View, NativeSyntheticEvent, TextInputChangeEventData, Dimensions, ScrollView} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextField from "../components/TextField";
import Button from "../components/Button";
import GoogleButton from "../components/GoogleButton";
import OutlookButton from "../components/OutlookButton";
import colors from "../static/colors";
import { LoginInfo, RootStackParamList, ErrorMessage } from "../types";
import { textInputChange } from "../utils/handleInputChange";
import { useAppDispatch } from "../redux/hooks";
import { updateUser } from "../redux/reducers/currentUserSlice";
import app, { buildingService, orgService } from "../utils/backendConnection/connection";
import styleConstants from "../static/styleConstants";
import Svg from "react-native-svg";
import Mailbox from "../../assets/mailbox.svg";
import ResLockModal from "../components/Modal";
import AppLoading from "../components/AppLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccessDenied from "./AccessDenied";
import { updateOrg } from "../redux/reducers/organizationSlice";
import handleErrors from "../utils/handleErrors";

// Set up navigation and children props for log in
type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">
const {width, height} = Dimensions.get("window")

const Login: FunctionComponent = ({navigation, route}: LoginProps) => {
    const [loginInfo, setLoginInfo] = useState<LoginInfo>();
    const [error, setError] = useState<ErrorMessage>({active: false, message:""});
    const [useModal, setUseModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    //redux action thing
    const dispatch = useAppDispatch();
    const onTextChange = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => textInputChange(event, setLoginInfo), [setLoginInfo]);
    
    const navigateCreateAccount = () => {
        // TODO: Fix the verification pages, They use an org_id that may not be needed (It 100% cannot be retrieved as a param)
        navigation.navigate("Email");
    }

    const login = async () => {
        try {
            setLoading(true);
            const user = await app.login(loginInfo);
            dispatch(updateUser(user));
            const [org] = await orgService.get(user.org_id);
            const buildings = await buildingService.get({org_id: user.org_id});
            org.buildings = buildings;
            dispatch(updateOrg(org));
            setLoading(false);
            navigation.navigate("Tabs");
        } catch (error) {
            setLoading(false);
            await app.logout(); // clear token on any log in errors
            // There was navigation here to AccessDenied which would then navigate back here. I think it makes more sense to stay on this page and just have them log in
            handleErrors(error, setUseModal, setModalText, setError);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.svg}>
                            <Svg width={"100%"} height={"80%"} viewBox={`0 0 800 600`}>
                                <Mailbox/>
                            </Svg>                        
                    </View>
                    <View>
                        <Text style={styles.login}>Login</Text>
                        <Text style={styles.subText}>{"We're glad you're here"}</Text>
                        <View style={styles.input}>
                            <TextField placeholder={"Email"} leftIcon={'email'} id={'email'} onChange={onTextChange} email/>
                        </View>
                        <View style={styles.input}>
                            <TextField placeholder={"Password"} leftIcon={'lock'} rightIcon={'lock-question'} onChange={onTextChange} secureTextEntry={true} id={'password'}/>
                        </View>
                        {error.active ? <Text style={[styles.subText, styles.error]}>{error.message}</Text> : null} 
                        <View style={styles.spacing}/>
                        <Button title={"Log In"} onPress={login}/>

                        <View style={styles.spacing}/>

                        <Text style={{textAlign: "center", marginTop: 40, marginBottom: 20}}>----- or connect with ----- </Text>

                        <View style={styles.row}>
                            <GoogleButton navigation={navigation}/>
                            <OutlookButton/>
                        </View>

                        <View style={styles.doesNotHaveAccount}>
                            <Text style={styles.subText}>First time logging in? </Text>
                            <View >
                                <Button title={'Verify your account'} onPress={navigateCreateAccount} isLink={true}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            {loading ? <AppLoading/> : null}
            {useModal ? <ResLockModal error setIsVisible={setUseModal} text={modalText}/> : null}
        </>
    );
};

const styles = StyleSheet.create({
    svg: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        height: height/3
    },
    input: {
        paddingTop: "6%"
    },
    container: {
        flex: 1,
        padding: "5%",
        paddingTop: "7%",
        backgroundColor: colors.WHITE,
        justifyContent: 'center'
    },
    login: {
        fontSize: styleConstants.headerFontSize,
        fontWeight: "bold",
        paddingBottom: "5%",
        paddingLeft: "2%",
    },
    subText: {
        fontSize: styleConstants.textFontSize,
        paddingLeft: "2%",
    },
    row: {
        flexDirection: "row",
    },
    spacing: {
        paddingTop: "5%",
        paddingBottom: "5%",
    },
    doesNotHaveAccount: {
        marginTop: "5%",
        flex: 1,
        flexDirection: 'row',
        alignSelf:'center',
        justifyContent: 'flex-end',
    },
    error: {
        color: colors.ERROR,
    }
});

export default Login;