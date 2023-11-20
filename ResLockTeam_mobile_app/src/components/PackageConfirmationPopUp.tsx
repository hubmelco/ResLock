import React from "react";
import { Text, StyleSheet, Button, View} from "react-native";
import { LargePopUp } from "../types";
import colors from "../static/colors";
import styleConstants from "../static/styleConstants";

const PackageConfirmationPopUp = ({message, yesButton, noButton}: LargePopUp) => {
    return (
        <View style={styles.container}>
            <Text> {message} </Text> {/*color={colors.DARK_BLUE} */}
            {/* <Button title={yesButton[].title} color={colors.WHITE}/>
            <Button title={noButton[].title} color={colors.WHITE}/> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.DARK_ORANGE,
        borderRadius: styleConstants.largeBorderRadius,
    },
});

export default PackageConfirmationPopUp;
