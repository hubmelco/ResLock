import React, { useState } from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import LargeRoundedButtonWorker from "../components/LargeRoundedButtonWorker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, UserInfo } from "../types";
import colors from "../static/colors";
import { useAppSelector } from "../redux/hooks";
import AccessDenied from "./AccessDenied";
import privileges from "../static/privilege";


type WorkerDashboardProps = NativeStackScreenProps<RootStackParamList, "WorkerDashboard">;


const WorkerDashboard: FunctionComponent = ({navigation}: WorkerDashboardProps) => {
    const user = useAppSelector((state) => state.user.user);
    if(user.privilege > privileges.WORKER) {
        return <AccessDenied/>
    }
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

    //TODO: disable buttons until location is picked
    return (
        <>
            <View style={styles.optionsContainer}>
                <LargeRoundedButtonWorker title={"Process Package"} navigation={navigation} isPackageBtn={true}/>
                <LargeRoundedButtonWorker title={"Process Letter"} navigation={navigation} isPackageBtn={false}/>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: colors.WHITE
    },
});

export default WorkerDashboard;