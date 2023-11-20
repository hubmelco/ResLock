import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../static/colors";
import { TextFieldProps } from "../types";
import { TextInput } from 'react-native-paper';
import styleConstants from "../static/styleConstants";


const TextField = ({leftIcon, rightIcon, placeholder, maxLength=100, secureTextEntry=false, onChange, id, numeric, email, onFocus, onBlur}: TextFieldProps) => {

    return (
        <View style={styles.containerStyle}>
            <TextInput
                left={ leftIcon ? <TextInput.Icon icon={leftIcon} color={'grey'}/> : null }
                right={ rightIcon ? <TextInput.Icon icon={rightIcon} color={'grey'}/> : null }
                secureTextEntry={secureTextEntry}
                editable
                style={styles.input}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(event) => onChange(event)}
                nativeID={id}
                activeUnderlineColor={colors.DARK_ORANGE}
                keyboardType={numeric ? "number-pad" : email ? 'email-address' : null}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    input: {
        height: styleConstants.inputMinHeight,
        borderBottomColor: '#000000',
        backgroundColor: colors.WHITE,
    }
});

export default TextField;
