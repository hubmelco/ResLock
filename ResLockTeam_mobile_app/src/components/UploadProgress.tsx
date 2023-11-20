import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import {Bar} from "react-native-progress";

import { ProgressProps } from "../types";

//Progress bar rather than rotating loading. Not used but left in if we want to switch later. Finding the progress value to pass in is difficult.
const UploadProgress: FunctionComponent<ProgressProps> = ({progress}) => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <Bar progress={progress} width={200}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        // Transparent
        backgroundColor: "rgba(0,0,0)",
        zIndex: 1,
    },
});

export default UploadProgress;
