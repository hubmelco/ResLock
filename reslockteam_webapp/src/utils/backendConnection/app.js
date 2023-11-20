import Service from "./service";
import environment from "../../config";
import request from "../request";

class App {

    constructor() {
        this.services = new Map();
        this.authService = new Service("session");
    }

    /**
     * Retrieves a service based on the name provided. If one is not found, it is created and returned.
     *
     * @param name the name of the service
     * @returns A service that can be used for CRUD operations
     */
    service(name) {
        if (!this.services.has(name)) {
            this.createService(name);
        }
        return this.services.get(name);
    }

    /**
     * 
     * @param arg1 Should be nothing or {email: string, password: string}
     * @returns the logged in user information 
     */
    async login(arg1){
        //default to empty login (for auto login the info is not used)
        const login = (arg1) ?? {
            email: "",
            password: "",
        };
        const response = await this.authService.create(login);
        localStorage.setItem("session", response.token);
        return response.user;
    }

    /**
     * Logs a user out by removing their session token
     *
     */
    logout() {
        return localStorage.removeItem("session");
    }

    /**
     * Verifies a newly created user's email is valid by confirming a one time code sent to the inputted email
     *
     * @param code The code sent to the user's inputted email
     * @returns A promise that contains an object that has a boolean value whether the verificaiton was a success or not
     */
    async verifyEmailCode(body) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };
        return await request(`${environment.APIEndpoint}/verifyOTP`, options);
    }

    async changePassword(body) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };
        return await request(`${environment.APIEndpoint}/changePassword`, options);
    }

    async sendVerificationCodeToEmail(email) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
        };
        return await request(`${environment.APIEndpoint}/sendOTP`, options);
    }

    /**
     * This function is used to call the backend service for OCR to read text from an image
     *
     * @param formData Data that contains an object with a "profile" key with the image data/details
     * @returns The text read from the data
     */
    async readImageText(formData) {
        const token = localStorage.getItem("session");
        const headers = {
            "Content-Type": "multipart/form-data",
            token: token,
        };
        const options = {
            method: "POST",
            mode: "cors",
            headers: headers,
            body: formData,
        };
        return await request(`${environment.APIEndpoint}/ocr`, options);
    }

    /**
     * Creates a service with the provided name
     *
     * @param name The name of the route
     */
    createService(name) {
        this.services.set(name, new Service(name));
    }
}

export default App;