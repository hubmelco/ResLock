import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { DropdownProps } from "../types";
import colors from "../static/colors";
import SelectDropdown from 'react-native-select-dropdown'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import styleConstants from "../static/styleConstants";

const Dropdown = ({options, leftIcon, onSelect, defaultText}: DropdownProps) => {

    return (
        <View style={styles.viewContainer}>
            <SelectDropdown
                data={options}
                onSelect={(selectedItem, index) => {
                    onSelect(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    return selectedItem.label
                }}
                rowTextForSelection={(selectedItem, index) => {
                    // text represented for each item in dropdown
                    return selectedItem.label
                }}
                buttonStyle={styles.dropdownBtnStyle}
                renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                    <View style={styles.dropdownBtnChildStyle}>
                        {leftIcon ? <FontAwesome5 name={leftIcon} size={23} color="grey"/>: null}
                        <View style={styles.dropdownBtnText}>
                            <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem.label : defaultText}</Text>
                        </View>
                    </View>
                );
                }}
                rowStyle={styles.dropdownRowStyle}
                renderDropdownIcon={isOpened => {
                    return (
                        <AntDesign name={isOpened ? 'caretup' : 'caretdown'} size={18} color={colors.LIGHT_BLUE} style={styles.dropdownIcon}/>
                    )
                    }
                }
          />
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,  
        backgroundColor: '#FFF'
    },
    dropdownBtnText: {
        justifyContent: 'center', 
        width:'70%'
    },
    dropdownIcon: {
        paddingHorizontal: "10%"
    },
    dropdownBtnStyle: {
      width: '100%',
      backgroundColor: '#FFF',
      paddingHorizontal: 0,
      borderWidth: 1,
      borderRadius: styleConstants.largeBorderRadius,
      borderColor: colors.MEDIUM_GREY,
    },
    dropdownBtnChildStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: "10%",
    },
    dropdownBtnTxt: {
      color: '#444',
      textAlign: 'left',
    },
    dropdownRowStyle: {
      borderBottomColor: colors.MEDIUM_GREY,
    },
  });
  

export default Dropdown;
