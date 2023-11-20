import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { DropdownOptionProps } from "../types";

type Field = {
    [key: string]: any;
}
const updateForm = (updatedValue: Field, setForm: React.Dispatch<React.SetStateAction<{}>>) => {
    setForm((formData) => ({
        ...formData,
        ...updatedValue
    }))
}

const textInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>, setForm: React.Dispatch<React.SetStateAction<{}>>) => {
    const updatedValue: Field = {};
    updatedValue[event.target["_internalFiberInstanceHandleDEV"].memoizedProps.nativeID] = event.nativeEvent.text
    updateForm(updatedValue, setForm);
}

const dropDownChange = (selectedItem: DropdownOptionProps, setForm: React.Dispatch<React.SetStateAction<{}>>) => {
    const updatedValue: Field = {};
    updatedValue['building_id'] = selectedItem.value;
    updateForm(updatedValue, setForm)
}

export { textInputChange, dropDownChange };