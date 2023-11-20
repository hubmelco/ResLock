import React, {useState, useEffect, useCallback} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";
import Login from "../pages/Login";
import { RootStackParamList } from "../types";
import MailInfoForm from "../pages/MailInfoForm";
import Settings from "../pages/Settings";
import HamburgerMenu from "../pages/HamburgerMenu";
import OTP from "../pages/OTP";
import Email from "../pages/Email";
import Password from "../pages/Password";
import BottomTabs from "./BottomTabNavigator";
import WorkerCamera from "../pages/WorkerCamera";
import AccessDenied from "../pages/AccessDenied";
import app, { buildingService, orgService } from "../utils/backendConnection/connection";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateUser } from "../redux/reducers/currentUserSlice";
import { updateOrg } from "../redux/reducers/organizationSlice";

import InformationRequest from "../pages/InformationRequest";
import AllPackages from "../pages/AllPackages";
import WorkerCheckout from "../pages/WorkerCheckout";

const Stack = createNativeStackNavigator<RootStackParamList>();
// Stop the splash screen from going away
preventAutoHideAsync().catch(() => {/* do nothing */})

const StackNavigator = () => {
    const [appIsReady, setAppIsReady] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user?.user)

    // Do stuff while the splash screen is showing (Try to login)
    useEffect(() => {
        async function prepare() {
            try {
                const user =  await app.login();
                dispatch(updateUser(user));
                const [org] = await orgService.get(user.org_id);
                const buildings = await buildingService.get({org_id: user.org_id})
                org.buildings = buildings;
                dispatch(updateOrg(org))
            } catch (e) {
                // ignore errors
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    // Hide the splash screen when we are done doing stuff
    const onReady = useCallback(async () => {
        if (appIsReady) {
            await hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <NavigationContainer onReady={onReady}>
             <Stack.Navigator initialRouteName={user ? "Tabs": "Login"} screenOptions={{headerShown: false, gestureEnabled: false}}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="MailInfoForm" component={MailInfoForm}/>
                <Stack.Screen name="HamburgerMenu" component={HamburgerMenu}/>
                <Stack.Screen name="OTP" component={OTP}/>
                <Stack.Screen name="Email" component={Email}/>
                <Stack.Screen name="Password" component={Password}/>
                <Stack.Screen name="Tabs" component={BottomTabs}/>
                <Stack.Screen name="WorkerCamera" component={WorkerCamera}/>
                <Stack.Screen name="AccessDenied" component={AccessDenied}/>
                <Stack.Screen name="InformationRequest" component={InformationRequest}/>
                <Stack.Screen name="AllPackages" component={AllPackages}/>
                <Stack.Screen name="WorkerCheckout" component={WorkerCheckout}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
