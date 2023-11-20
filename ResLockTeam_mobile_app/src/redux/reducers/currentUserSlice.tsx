import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { CurrentUser, MailInfo } from "../../types";

// Define a type for the slice state
interface userState {
    user: CurrentUser;
}

// Define the initial state using that type
const initialState: userState = {
    user: null
};

export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<CurrentUser>) => {
            state.user = action.payload;
        },
        // Idk if we will need these, but put it in just in case
        updateMail: (state, action: PayloadAction<Array<MailInfo>>) => {
            state.user.mail = action.payload;
        },
    },
});

export const { updateUser, updateMail } = currentUserSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user.user;

export default currentUserSlice.reducer;
