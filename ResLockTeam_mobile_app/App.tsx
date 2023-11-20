import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import StackNavigator from "./src/Navigation/StackNavigator";
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from "expo-status-bar";

const App = () => {
    return (
        <Provider store={store}>
            <PaperProvider>
                <StatusBar style="dark"/>
                <StackNavigator/>
            </PaperProvider>
        </Provider>
    );
};

export default App;
