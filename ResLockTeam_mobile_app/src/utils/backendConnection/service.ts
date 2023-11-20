import environment from "../../../config";
import request from "../request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatabaseTypes } from "../../types";

class Service {
    private route: string;

    public constructor(service: string) {
        this.route = `${environment.APIEndpoint}/${service}`;
    }

    /**
     * This function is used to make a create request to the server
     *
     * @param body The parameters needed to create the resource. NOTE not all fields are required (some are auto generated such as ids and dates)
     * @returns A success message  //TODO Maybe update backend to return the created resource
     */
    public async create(body: DatabaseTypes): Promise<any> {
        const headers = await this.createHeaders();
        const options: RequestInit = {
            method: "POST",
            mode: "cors",
            headers: headers,
            body: JSON.stringify(body),
        };
        return await request(this.route, options);
    }

    /**
     * Retrieve a unique resource by its id
     * 
     * @param id The identifier for the resource
     * @returns A promise that resolves to an array of with a single resource
     */
    public async get(id: number | string): Promise<any>;

    /**
     * Retrieve a resource(s) by key value pairs
     * 
     * @param query An object of key value pairs that can identify the resource (database keys and values)
     * @returns A promise that resolves to an array of the requested resource(s)
     */
    public async get(query: Record<string, any>): Promise<any>;

    /*
     * This is the implementation of the stub functions above. The stub functions are needed to give proper documentation with typescript
     */
    public async get(arg1: unknown): Promise<any> {
        let id = "";
        let query: undefined | Record<string, string> = undefined;
        // Overloaded function checks
        if (typeof arg1 === "string" || typeof arg1 === "number") {
            id = arg1 as string //it will be converted to a string below anyways if its a number
        } else {
            query = arg1 as Record<string, string> // similar to above comment
        }
        const headers = await this.createHeaders();
        const options: RequestInit = {
            method: "GET",
            mode: "cors",
            headers: headers
        };
        return await request(`${this.route}/${id}`, options, query);
    }

    /**
     * Updates the resource identified by the id with the body information
     *
     * @param id The ID of the resource to be updated
     * @param body The new information for the resource to be updated to
     * @returns A success string or error string //TODO: may want to return the updated resource
     */
    public async update(id: number | string, body: object): Promise<any> {
        const headers = await this.createHeaders();
        const options: RequestInit = {
            method: "PUT",
            mode: "cors",
            headers: headers,
            body: JSON.stringify(body),
        };
        return await request(`${this.route}/${id}`, options);
    }

    /**
     * This function deletes a resource given its id
     *
     * @param id The ID of the resource to be deleted
     * @returns Also a success or error message //TODO may want to update to return the deleted resource
     */
    public async delete(id: number | string): Promise<any> {
        const headers = await this.createHeaders();
        const options: RequestInit = {
            method: "DELETE",
            mode: "cors",
            headers: headers,
        };
        return await request(`${this.route}/${id}`, options);
    }

    /**
     * This function was made because token was getting caught as a string instead of null in the backend when it was null. it was "null"
     */
    private createHeaders = async () => {
        const headers: {"Content-Type": string, token?: string} = {"Content-Type": "application/json"}
        const token = await AsyncStorage.getItem("session");
        if (!token) {
            return headers;
        }
        headers.token = token;
        return headers
    }
}

export default Service;
