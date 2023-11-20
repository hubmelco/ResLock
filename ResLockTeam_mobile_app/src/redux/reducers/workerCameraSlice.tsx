import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CameraCapturedPicture } from "expo-camera";

// Define a type for the slice state
interface WorkerCameraState {
    image: CameraCapturedPicture;
}

// Define the initial state using that type
const initialState: WorkerCameraState = {
    image: null,
};

export const workerCameraSlice = createSlice({
    name: "workerCamera",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateImage: (state, action: PayloadAction<CameraCapturedPicture>) => {
            state.image = action.payload;
        }
    },
});

export const { updateImage } = workerCameraSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectImage = (state: RootState) => state.workerCamera.image;

export default workerCameraSlice.reducer;
