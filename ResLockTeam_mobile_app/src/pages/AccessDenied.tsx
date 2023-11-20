import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../types";
import AccessDeniedSvg from "../../assets/access-denied.svg";
import Svg from "react-native-svg";
import Button from "../components/Button";

type AccessDeniedProps = NativeStackScreenProps<RootStackParamList, "AccessDenied">;

const AccessDenied: FunctionComponent = ({ navigation }: AccessDeniedProps) => {

    return (
        <View style={styles.svg}>
            <Svg width={'100%'} height={'40%'} viewBox={' 0 0 790 512'}>
                <AccessDeniedSvg/>
            </Svg>
            <Text style={styles.sorry}>
                Sorry...
            </Text>
            <Text style={styles.permissions}>
                You do not have permission to access this page.
            </Text>
            <Text style={styles.administrator}>
                Please contact your system administrator if you feel this is a mistake.
            </Text>
            <View style={styles.loginRow}>
                <View style={styles.items}>
                    <Text>
                        Did your session timeout?    
                    </Text>
                    <Text>  </Text>
                    <Button onPress={() => navigation.navigate("Login")} isLink={true} title={"Login"}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    svg: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    sorry: {
        alignSelf: 'center',
        fontSize: 40,
        paddingBottom: 20
    },
    permissions: {
        alignSelf: 'center',
        fontSize: 22,
        textAlign: 'center',
        paddingBottom: 10,
    },
    administrator: {
        textAlign: 'center',
        paddingBottom: 120,
    },
    loginRow: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignSelf: 'center',
    },
    items: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 65,
        paddingBottom: '5%'
    }
})

export default AccessDenied;
