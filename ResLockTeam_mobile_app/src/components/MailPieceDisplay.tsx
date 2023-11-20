import React, {useState, useEffect} from "react";
import { StyleSheet, View } from "react-native";
import { BuildingInfo, MailPieceDisplayProps } from "../types";
import colors from "../static/colors";
import { Ionicons } from "@expo/vector-icons";
import { buildingService } from "../utils/backendConnection/connection";
import styleConstants from "../static/styleConstants";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MailPieceDisplay = ({ building_id, date, isLetter, pickUpDate }: MailPieceDisplayProps) => {
    const [name, setName] = useState<string>()

    useEffect(() => {
        const getBuildingName = async () => {
              const [building]: Array<BuildingInfo> = await buildingService.get(building_id)
              return building.name
        };
        getBuildingName().then((result) => setName(result))
    }, [])

    return (
        <View style={styles.LargeButtonStyle}>
            <View style={styles.seperateRow}>
                <View style={styles.row}>
                    {isLetter ? 
                        <Ionicons style={styles.cube} name={"mail-open-outline"} size={styleConstants.smallIconSize}/>
                        : 
                        <MaterialCommunityIcons style={styles.cube} name="package-variant" size={styleConstants.smallIconSize + 2}/>
                    }
                    <Text variant="bodyMedium">{name}</Text>
                </View>
                <View>
                    <Text variant="bodyMedium">{date.toString().split("T")[0]}</Text>
                </View>
            </View> 
            {pickUpDate && 
                <View style={styles.row}>
                    <Text variant="bodyMedium"> Picked Up: </Text>
                    <Text variant="bodyMedium"> {date.toString().split("T")[0]} </Text>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    LargeButtonStyle: {
        flex: 1,
        alignSelf: 'center',
        width: "100%",
        borderBottomColor: colors.DARK_GREY,
        paddingBottom: '3%',
        borderBottomWidth: 1
    },
    title: {
        flex: 1,
        fontSize: styleConstants.headerFontSize,
        color: colors.LIGHT_BLUE,
    },
    cube: {
        color: colors.LIGHT_BLUE,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "3%",
        gap: 5
    },
    seperateRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default MailPieceDisplay;
