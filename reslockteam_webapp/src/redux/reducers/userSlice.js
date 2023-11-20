import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState = {
    user: null
};

export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { updateUser } = currentUserSlice.actions;

export const getUser = (state) => state.user.user;

export default currentUserSlice.reducer;
