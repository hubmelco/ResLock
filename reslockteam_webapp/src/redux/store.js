import { configureStore } from "@reduxjs/toolkit";
import currentUser from "./reducers/userSlice"
import organizationSlice from "./reducers/organizationSlice";

const store = configureStore({
    reducer: {
        user: currentUser,
        organization: organizationSlice,
    },
});

export default store;
