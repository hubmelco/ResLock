import React, {FunctionComponent} from "react";
import {View, StyleSheet} from "react-native";
import LottieView from "lottie-react-native"

const AppLoading:FunctionComponent = () => {
    return(
        <View style={ [StyleSheet.absoluteFillObject, styles.container] }>
            <LottieView source={require("../../assets/loading.json")} autoPlay loop/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        // Transparent
        backgroundColor: "rgba(0,0,0)",
        zIndex:1,
    }
})

export default AppLoading;