import AsyncStorage from "@react-native-async-storage/async-storage";

import Service from "./service";
import { CurrentUser, emailVerificationInfo, LoginInfo } from "../../types";
import environment from "../../../config";
import request from "../request";

class App {
    // would ideally just be type Service
    private services: Map<string, Service>;
    private authService: Service;

    public constructor() {
        this.services = new Map();
        this.authService = new Service("session");
    }

    /**
     * Retrieves a service based on the name provided. If one is not found, it is created and returned.
     *
     * @param name the name of the service
     * @returns A service that can be used for CRUD operations
     */
    public service(name: string): Service {
        if (!this.services.has(name)) {
            this.createService(name);
        }
        return this.services.get(name);
    }

    /**
     * Log in automatically using the token generated from a previous session
     *
     * @returns A user with their relavent information in an object
     */
    public async login(): Promise<CurrentUser>;

    /**
     * Login with an email an password
     *
     * @param login An object with an email and password
     * @returns A user with their relavent information in an object
     */
    public async login(login: LoginInfo): Promise<CurrentUser>;

    /*
     * Implementation of the above stub functions. This is an overloaded function and the
     * above stubs allow typescript to provide the correct information to develeopers. This
     * fixes the error on the login page WOOOH
     */
    public async login(arg1?: unknown): Promise<CurrentUser> {
        //default to empty login (for auto login the info is not used)
        const login: LoginInfo = (arg1 as LoginInfo) ?? {
            email: "",
            password: "",
        };
        const response = await this.authService.create(login as LoginInfo);
        await AsyncStorage.setItem("session", response.token);
        return response.user;
    }

    /**
     * Logs a user out by removing their session token
     *
     * @returns A promise that'll succeed if the token is removed
     */
    public async logout(): Promise<void> {
        return await AsyncStorage.removeItem("session");
    }

    /**
     * Verifies a newly created user's email is valid by confirming a one time code sent to the inputted email
     *
     * @param code The code sent to the user's inputted email
     * @returns A promise that contains an object that has a boolean value whether the verificaiton was a success or not
     */
    public async verifyEmailCode(body: emailVerificationInfo): Promise<any> {
        const options: RequestInit = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };
        return await request(`${environment.APIEndpoint}/verifyOTP`, options);
    }

    public async sendVerificationCodeToEmail(email: string): Promise<any> {
        const options: RequestInit = {
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
    public async readImageText(formData: FormData) {
        const token = await AsyncStorage.getItem("session");
        const headers = {
            "Content-Type": "multipart/form-data",
            token: token,
        };
        const options: RequestInit = {
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
    private createService(name: string): void {
        this.services.set(name, new Service(name));
    }
}

export default App;