import React from "react";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { render } from "@testing-library/react-native";

import {createStore} from "../redux/store";

export function renderWithRedux(component: React.ReactElement) {
    return render(
        <Provider store={createStore()}>
            <PaperProvider>
                {component}
            </PaperProvider>
        </Provider>
    );
}
