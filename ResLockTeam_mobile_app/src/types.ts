/**
 * Current types file
 * 
 * We may need to reorganize how we store types
 */
import { NativeSyntheticEvent, TextInputChangeEventData, GestureResponderEvent } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dispatch, SetStateAction } from "react";


export interface TextFieldProps {
    /**
     * will need to figure out icon library and change it from a bool
     */
    leftIcon?: string;
    rightIcon?: string;
    placeholder?: string;
    maxLength?: number;
    secureTextEntry?: boolean;
    onChange: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    id: string;
    numeric?: boolean;
    email?: boolean;
    value?: string;
    type?: string;
    onFocus?: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onBlur?: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
}


export interface FooterProps {
   dashboardType: string;
   navigation?: NativeStackNavigationProp<RootStackParamList, "ResidentDashboard", undefined> 
   | NativeStackNavigationProp<RootStackParamList, "AllQRCheckout", undefined>
   | NativeStackNavigationProp<RootStackParamList, "IndividualQRCheckout", undefined>
   | NativeStackNavigationProp<RootStackParamList, "WorkerDashboard", undefined>
   | NativeStackNavigationProp<RootStackParamList, "WorkerQRCode", undefined>;
   
}

export interface ResidentHeaderProps{
    navigation?: NativeStackNavigationProp<RootStackParamList, "ResidentDashboard", undefined> 
    | NativeStackNavigationProp<RootStackParamList, "AllQRCheckout", undefined>
    | NativeStackNavigationProp<RootStackParamList, "IndividualQRCheckout", undefined>;
}

export interface PackageVerificationProps{
    navigation?: NativeStackNavigationProp<RootStackParamList, "IndividualQRCheckout", undefined>;
    id: number;
}

export interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    type?: "Primary" | "Secondary";
    isLink?: boolean;
    disabled?: boolean;
}

export interface ToggleProps {
    onPress: (isSwitchOn: boolean) => void;
}

export interface LargeButtonWorkerProps {
    title: string;
    navigation?: NativeStackNavigationProp<RootStackParamList>;
    isPackageBtn: boolean;
    date?: string;
}

export interface MailPieceDisplayProps {
    building_id: number;
    date: Date;
    isLetter: boolean;
    pickUpDate?: Date;
}

export interface DropdownOptionProps {
    value: string | number;
    label: string;
}

export interface DropdownProps {
    options: DropdownOptionProps[];
    onSelect: (selectedItem: any) => void;
    leftIcon?: string;
    defaultText: string;
}

export interface UserInfo {
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    room: number,
    privilege: number,
    org_id: number,
    building_id: number,
    verified: boolean,
}

export interface CurrentUser extends UserInfo {
    mail: Array<MailInfo>;
};

export interface ResidentItemInfo {
    title: string,
    date: string,
    type: string,
    onPress: (event: GestureResponderEvent) => void,
}

export type LoginInfo = {
    email: string;
    password: string;
}

export type RootStackParamList = {
    WorkerCamera: undefined;
    MailInfoForm: {
        isLetter: boolean;
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: number;
        roomNumber?: number;
    };
    CreateAccount: {org_id: number};
    AccessDenied: undefined;
    Login: undefined;
    WorkerDashboard: undefined;
    WorkerQRCode: undefined;
    SelectOrg: undefined;
    Settings: undefined;
    ResidentDashboard: {emailAddress: string};
    AllQRCheckout: undefined;
    IndividualQRCheckout: {id: number};
    HamburgerMenu: undefined;
    OTP: {org_id: number, email: string};
    Email: {org_id: number};
    Password: {email: string, jwt: string};
    Tabs: undefined;
    Header: undefined;
    InformationRequest: undefined;
    AllPackages: undefined;
    WorkerCheckout: {
        resident: {name: string, building: string, room: number }
        mail: MailInfo[]
    }
}

export interface LargePopUp {
    message: string;
    yesButton: ButtonProps[];
    noButton: ButtonProps[];
}

export interface MailInfo {
  mail_id: number;
  date_received: string;
  date_picked_up: string | null | undefined;
  is_letter: boolean;
  email: string;
  building_id: number;
}

export interface BuildingInfo {
  building_id: number;
  org_id: number;
  name: string;
  addr: string;
  building_code: string;
}

export interface OrganizationInfo {
  org_id: number;
  name: string;
}

export interface ExtendedOrganizationInfo extends OrganizationInfo {
    buildings: BuildingInfo[]
}

export type emailVerificationInfo = {
    email: string;
    otp: number;
}

// The types used for create calls. I can create explicit types if they would help more thaan the Omit<> stuff. Omit is just saying dont include the keys noted in the object.
export type CreateDatabaseTypes = UserInfo | Omit<BuildingInfo, "building_id"> | Omit<OrganizationInfo, "org_id"> | Omit<MailInfo, "mail_id" | "date_received" | "date_picked_up"> | LoginInfo | emailVerificationInfo;

export type ModalProps = {
    error?: boolean;
    success?: boolean;
    information?: boolean;
    text?: string;
    setIsVisible: ReactStateSetter<boolean>;
    onContinue?: (event: GestureResponderEvent) => void;
}

export type ProgressProps = {
    // Should be a number between 0 and 1
    progress: number;
}

export type ReactStateSetter<T> = Dispatch<SetStateAction<T>>

export type ErrorMessage = {active: boolean, message: string}