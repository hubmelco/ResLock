import React from "react";
import { StyleSheet, Text, TouchableOpacity} from "react-native";
import { ButtonProps } from "../types";
import colors from "../static/colors";
import fonts from "../static/styleConstants"
import styleConstants from "../static/styleConstants";

const Button = ({title, onPress, type="Primary", isLink=false, disabled=false}: ButtonProps) => {
    const buttonStyles = isLink ? styles.buttonLink : [styles["button"], styles["button" + type]]
    const textStyles = isLink ? styles.textLink : styles.text

    return (
        <TouchableOpacity style={disabled ? [styles.button, styles.buttonDisabled] : buttonStyles} onPress={onPress} disabled={disabled} testID="button">
            <Text style={textStyles}>{title}</Text>
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        height: styleConstants.inputMinHeight
    },
    buttonLink: {
        flex: 1,
        backgroundColor: "transparent"
    },
    textLink: {
        textDecorationLine: "underline",
        color: colors.DARK_ORANGE,
        fontSize: fonts.textFontSize
    },
    text: {
        color: colors.WHITE,
        fontSize: fonts.textFontSize
    },
    buttonPrimary: {
        backgroundColor: colors.DARK_ORANGE,
    },
    buttonSecondary: {
        backgroundColor: colors.DARK_BLUE,
    },
    buttonDisabled: {
        backgroundColor: colors.DARK_GREY
    }
});

export default Button;
