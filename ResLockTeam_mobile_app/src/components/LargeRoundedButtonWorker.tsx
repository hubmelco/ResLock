import React from "react";
import { Text, StyleSheet, View, TouchableOpacity} from "react-native";
import { LargeButtonWorkerProps } from "../types";
import colors from "../static/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import styleConstants from "../static/styleConstants";


const LargeRoundedButtonWorker = ({title, navigation, isPackageBtn, date}: LargeButtonWorkerProps) => {
  if (isPackageBtn) { //button for scanning packages
  return (
        <TouchableOpacity style={styles.LargeButtonStyle} onPress={() => navigation.navigate('WorkerCamera')} activeOpacity={0.5}>
            <View style={styles.inlineStyle}>
              <Ionicons name='cube-outline' size={styleConstants.xlIconSize} color="white"></Ionicons>
              <Text style={styles.text}>{title}</Text>
              <Text>{date}</Text>
              <Ionicons name='arrow-forward' size={styleConstants.xlIconSize} color='white'></Ionicons>
            </View>
        </TouchableOpacity>
    );
  } else { //button for scanning letters
    return (
      <TouchableOpacity style={styles.LargeButtonStyle} onPress={() => navigation.navigate('WorkerCamera')} activeOpacity={0.5}>
            <View style={styles.inlineStyle}>
              <Ionicons name='mail-outline' size={styleConstants.xlIconSize} color="white"></Ionicons>
              <Text style={styles.text}>{title}</Text>
              <Text>{date}</Text>
              <Ionicons name='arrow-forward' size={styleConstants.xlIconSize} color='white'></Ionicons>
            </View>
        </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
    LargeButtonStyle: {
        padding: "2%",
        margin: "5%",
        backgroundColor: colors.DARK_ORANGE,
        borderRadius: styleConstants.smallBorderRadius,
        height: "30%",
        width: "80%",
    },
    inlineStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: "5%",
    },
    buttonIconStyle: {
    width: styleConstants.mediumIconSize,
  },
  text: {
    textAlign: "left",
    justifyContent: 'center',
    width: '50%',
    fontSize: styleConstants.headerFontSize,
    color: colors.WHITE,
  }
});

export default LargeRoundedButtonWorker;
