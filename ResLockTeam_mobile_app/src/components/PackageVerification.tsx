import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../static/colors";
import Button from "./Button";
import { PackageVerificationProps } from "../types";

const PackageVerification = ({navigation, id }: PackageVerificationProps) => {

    const onYesClicked = () => {
            // TODO
            // backend call to delete mail piece using id. Not sure if this is needed. Backend will be updated when worker scans. Maybe this just updates the frontend?
        navigation.pop();
    }
    
    return  (
        <View style={styles.verificationContent}>
            <Text style={styles.text}>
                Did you receive this package? 
            </Text>
            <View style={styles.buttons}>
                <Button title={'yes'} type={"Primary"} onPress={onYesClicked}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    verificationContent: {
        padding: 10,
        margin: 10,
        backgroundColor: colors.LIGHT_GREY,
        borderRadius: 10,
        height: 275,
        width: 300,
    },
    date: {
        fontSize: 20,
        paddingLeft: 10,
    },
    title: {
        paddingTop: 40,
        paddingLeft: 20,
        fontSize: 30,
    },
    cube: {
        paddingTop: 25,
        paddingLeft: 10,
    },
    text: {
        fontSize: 40,
        color: colors.LIGHT_BLUE,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        paddingTop: 30,
    },

});
export default PackageVerification;    
