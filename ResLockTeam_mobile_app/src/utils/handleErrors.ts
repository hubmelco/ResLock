import { ReactStateSetter, ErrorMessage } from "../types";

/**
 * This function handles any errors that occur from a server or library call
 * 
 * @param error The error that should be handled
 * @param setUseModal The flag setter to set whether a modal is used
 * @param setModalText The string setter to change the modal text
 * @param setError The setter used to display an error message if applicable
 */
const handleErrors = (error: any, setUseModal: ReactStateSetter<boolean>, setModalText: ReactStateSetter<string>, setError?: ReactStateSetter<ErrorMessage>) => {
    // This should hopefully catch any library errors
    if (!error.status) {
        setUseModal(true);
        setModalText(error.message); // This may be undefined and will lead to empty text modals. Can maybe change to "Unexpected error occured, try restarting the app"?
        return;
    }
    if (error.status >= 500 && error.status < 600) {
        //Most likely ugly SQL text so a custom message used
        setUseModal(true);
        setModalText("An unexpected error occured. The server may be down");
    } else if (error.status >= 400 && error.status < 500) {
        if (!setError) {
            console.error("setError not passed into handleErrors for bad user input (status 400)");
            return;
        }
        setError({ active: true, message: error.error });
    } else {
        console.error("Undefined error handler for: ", error);
    }
}

export default handleErrors;