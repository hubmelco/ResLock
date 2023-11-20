import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FooterProps } from "../types";
import colors from "../static/colors";
import { Ionicons } from '@expo/vector-icons';

const Footer = ({dashboardType, navigation}: FooterProps) => {
    
    if(dashboardType=="Worker") {
        return (
            <View style={styles.bottomPosition}>
                <View style={styles.inlineStyleWorker}>
                    <TouchableOpacity onPress={() => navigation.navigate('ResidentDashboard')}>
                        <Ionicons name='home-outline' size={45} color="grey"></Ionicons>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('WorkerDashboard')}>
                        <Ionicons name='camera-outline' size={45} color="grey"></Ionicons>
                    </TouchableOpacity> 
                    
                    <TouchableOpacity onPress={() => navigation.navigate('WorkerQRCode')}>
                        <Ionicons name='qr-code-outline' size={45} color="grey"></Ionicons>  
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.bottomPosition}>
                <View style={styles.inlineStyleResident}>
                    <TouchableOpacity onPress={() => navigation.navigate('ResidentDashboard')}>
                        <Ionicons name='home-outline' size={45} color="grey"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AllQRCheckout')}>
                        <Ionicons name='qr-code-outline' size={45} color="grey"></Ionicons>
                    </TouchableOpacity>  
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    bottomPosition: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        height: 100,
        width: '100%',
        backgroundColor: colors.WHITE,
        alignSelf: 'center',
        borderTopWidth: 3,
        borderTopColor: colors.DARK_GREY,
    },
    inlineStyleWorker: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingBottom: '5%',
    },
    inlineStyleResident: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 80,
        paddingBottom: '5%'
    }
});

export default Footer;
