import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { DropdownOptionProps } from "../types";
import { useAppSelector } from "../redux/hooks";
import Dropdown from "./Dropdown";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import styleConstants from "../static/styleConstants";
import createDropDownPropOptions from "../utils/createDropDownProps";

export type HeaderProps = NativeStackScreenProps<RootStackParamList, "Header">

const Header = ({navigation}: HeaderProps) => {
    const user = useAppSelector((state) => state.user.user);
    const org_buildings = useAppSelector((state) => state.organization.organization.buildings);

    const [location, setLocation] = useState<number>();
    const [buildings, setBuildings] = useState<Array<DropdownOptionProps>>([])

    const onDropdownChange = (selectedItem: {name: string, value: number}) => {
        setLocation(selectedItem.value)
    }

    useEffect(() => {
        const transformed = createDropDownPropOptions(org_buildings, "name", "building_id");
        setBuildings(transformed);
    }, [org_buildings]);

    const navigateMenu = () => {
        navigation.navigate('HamburgerMenu');
    }

    return(
        <View style={styles.header}>
            {/* TODO: import organization's logo */}
            <View style={styles.items}>

            <Image style={styles.logo} source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Milwaukee_School_of_Engineering_logo.svg/1200px-Milwaukee_School_of_Engineering_logo.svg.png"}}/>
            {user.privilege <= 2 ? 
                <View style={styles.dropdown}>
                    <Dropdown options={buildings} onSelect={onDropdownChange} defaultText={"Select Location"}/>
                </View>
            : null}
            <TouchableOpacity style={styles.menu} onPress={() => navigateMenu()}>
                <Feather name="menu" size={styleConstants.mediumIconSize} color="black" />
            </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'contain', 
        width: styleConstants.largeIconSize, 
        height: styleConstants.largeIconSize,
    },
    menu: {
        resizeMode: 'contain',
        width: styleConstants.largeIconSize,
        height: styleConstants.largeIconSize,
        justifyContent: 'center'
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignContent: "center",
        paddingTop: "10%",
        paddingBottom: "20%",
    },
    items: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: "5%"
    },
    dropdown: {
        width: "60%",
    },
})

export default Header;