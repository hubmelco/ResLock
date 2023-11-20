import React, { FunctionComponent } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { MailInfo, RootStackParamList} from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../static/colors";
import { AntDesign } from '@expo/vector-icons';
import { useAppSelector } from "../redux/hooks";
import styleConstants from "../static/styleConstants";
import { Text } from 'react-native-paper';
import MailPieceDisplay from "../components/MailPieceDisplay";

type AllPackagesProps = NativeStackScreenProps<RootStackParamList, "AllPackages">

const AllPackages: FunctionComponent = ({navigation}: AllPackagesProps) => {

    const user = useAppSelector((state) => state.user.user);

    const onExit = () => {
        navigation.pop();
    }

    const renderItemComponent = (itemData: MailInfo) => {
        return <MailPieceDisplay building_id={itemData.building_id} date={itemData.date_received} isLetter={itemData.is_letter} pickUpDate={itemData.date_picked_up}/>
    }

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AntDesign name="arrowleft" size={styleConstants.largeIconSize} color={colors.DARK_GREY} onPress={onExit}/>
                    <View style={styles.headerText}>
                        <Text variant="headlineMedium"> All Packages </Text>
                    </View>
                </View>
                <View style={styles.itemList}>
                    <View>
                        <FlatList data={user?.mail} renderItem={item => renderItemComponent(item.item)} ItemSeparatorComponent={() => <View style={{height: 30}}/>}/>  
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    container: {
        flex: 1,
        padding: '6%'
    },
    header: {
        flexDirection: 'row',
        paddingTop: '10%',
    },
    headerText: {
        paddingLeft: '5%',
    },
    itemList: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'stretch',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        paddingTop: '10%'
    },
});

export default AllPackages;