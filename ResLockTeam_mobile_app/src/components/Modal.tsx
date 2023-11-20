import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity} from "react-native";
import { ModalProps } from "../types";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import styleConstants from "../static/styleConstants";
import Button from "./Button";
import { Entypo } from '@expo/vector-icons';
import colors from "../static/colors";

const ResLockModal = ({error = false, success = false, information=false, text, onContinue, setIsVisible}: ModalProps) => {

    const onContinuePressed = (e) => {
        e.preventDefault();
        setIsVisible(false) 
        onContinue(e);
    }

    return (
            <Modal animationType="fade" transparent={true} visible={true} 
                onRequestClose={() => {
                    setIsVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.exit}>
                            <TouchableOpacity onPress={() => {setIsVisible(false)}}>
                                <Entypo name="cross" size={styleConstants.mediumIconSize} color={colors.MEDIUM_GREY} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconView}>
                            {error ? <><Ionicons name="warning" size={styleConstants.xlIconSize} color={colors.ERROR} /></> : null}
                            {success ? <FontAwesome5 name="thumbs-up" size={styleConstants.xlIconSize} color="green" /> : null}
                            {information ? <Ionicons name="information-circle" size={styleConstants.xlIconSize} color={colors.LIGHT_BLUE} />: null}
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>
                                {text}
                            </Text>
                        </View>
                        <View style={styles.buttonView}>
                            <View style={styles.button}>
                                {onContinue ? <Button title={"Try Again"} onPress={(e) => onContinuePressed(e)}/> : null}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: "10%",
        backgroundColor: colors.WHITE,
        borderRadius: styleConstants.smallBorderRadius,
        padding: "5%",
        height: "35%",
        width: "70%",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    exit: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "row",
        width: "100%",
    },
    textView: {
        flex: 1,
        paddingTop: "10%",
        height: "40%",
        alignItems: 'center',
    },
    text: {
        textAlign: 'center'
    },
    iconView: {
        flex: 1,
        alignItems: 'center',
        fontSize: styleConstants.textFontSize
    },
    buttonView:{
        flex: 1,
        flexDirection: 'column',
        width: "50%",
        justifyContent: "flex-end"
    },
    button: {
        height: styleConstants.inputMinHeight
    }
});

export default ResLockModal;
