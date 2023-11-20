import { DropdownOptionProps } from "../types";

/**
 * Creates dropdown prop options given on array
 * 
 * @param array An array of objects to map through and get values from
 * @param labelKey A key in the object that can be used to get a "label" value from
 * @param valueKey A key in the object that can be used to get a "value" value from
 * @returns 
 */
const createDropDownPropOptions = (array: any[], labelKey: string, valueKey: string) => {
    const props = array.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
    }));
    return props as DropdownOptionProps[];
}

export default createDropDownPropOptions;