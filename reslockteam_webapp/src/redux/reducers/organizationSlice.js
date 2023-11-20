import { createSlice } from "@reduxjs/toolkit";


// Define the initial state using that type
const initialState = {
    organization: null,
};

export const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        updateOrg: (state, action) => {
            state.organization = action.payload;
        },
        updateBuildings: (state, action) => {
            state.organization.buildings = action.payload;
        }
    },
});

export const { updateOrg, updateBuildings } = organizationSlice.actions;

export const getOrganization = (state) => state.organization.organization;

export default organizationSlice.reducer;
