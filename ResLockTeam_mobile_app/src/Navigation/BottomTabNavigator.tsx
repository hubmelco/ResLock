import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from "react-native";
import Dashboard from '../pages/Dashboard';
import WorkerDashboard from '../pages/WorkerDashboard';
import WorkerQRCode from '../pages/WorkerQRCode';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Header from '../components/Header';
import { useAppSelector } from '../redux/hooks';
import colors from '../static/colors';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
type TabProps = NativeStackScreenProps<RootStackParamList, "Header">

const tabOptions = [
  { name: 'My Packages', component: Dashboard }, //changed names to be more intuitive to users
  { name: 'Scan Mail', component: WorkerDashboard },
  { name: 'Scan QR', component: WorkerQRCode },
];

function BottomTabs({navigation}: TabProps) {
  const user = useAppSelector((state) => state.user.user);


  const filteredTabs = tabOptions.filter((tab, index) => {
    if (user.privilege > 2) {
      // only include home page for residents
      return index === 0; 
    } 
    return true; // include all tabs for other users
  });

  return (
    <View style={styles.view}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'My Packages') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Scan Mail') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Scan QR') {
              iconName = focused ? 'scan' : 'scan-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={30} color={color} />;
          },
          tabBarActiveTintColor: colors.DARK_ORANGE,
          tabBarInactiveTintColor: colors.DARK_BLUE,
          header: ()=> <Header navigation={navigation} route={undefined}/>
        })}
      >
        {filteredTabs.map((tab) => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.WHITE
  },
});

export default BottomTabs;