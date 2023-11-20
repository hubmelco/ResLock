import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../static/colors";
import styleConstants from "../static/styleConstants";
import fonts from "../static/styleConstants";

const OutlookButton = () => {
    const onPress = () => {
        // TODO add microsoft SSO stuff here
        return;
    };

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>Outlook</Text>
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
        backgroundColor: colors.OUTLOOK,
    },
    text: {
        color: colors.WHITE,
        fontSize: fonts.textFontSize,
    },
});

export default OutlookButton;
