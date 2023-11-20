import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ExtendedOrganizationInfo } from "../../types";

// Define a type for the slice state
interface organizationState {
    organization: ExtendedOrganizationInfo;
}

// Define the initial state using that type
const initialState: organizationState = {
    organization: null,
};

export const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        updateOrg: (state, action: PayloadAction<ExtendedOrganizationInfo>) => {
            state.organization = action.payload;
        },
    },
});

export const { updateOrg } = organizationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getOrganization = (state: RootState) => state.organization.organization;

export default organizationSlice.reducer;
