import { configureStore, combineReducers } from "@reduxjs/toolkit";
import workerCameraReducer from "./reducers/workerCameraSlice";
import currentUser from "./reducers/currentUserSlice"
import organizationSlice from "./reducers/organizationSlice";


// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
    user: currentUser,
    workerCamera: workerCameraReducer,
    organization: organizationSlice,
});

export const createStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

const store = createStore()

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
