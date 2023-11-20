import environment from "../../config";
import request from "../request";

class Service {
    route;

    constructor(service) {
        this.route = `${environment.APIEndpoint}/${service}`;
    }

    /**
     * This function is used to make a create request to the server
     *
     * @param body The parameters needed to create the resource. NOTE not all fields are required (some are auto generated such as ids and dates)
     * @returns A success message  //TODO Maybe update backend to return the created resource
     */
    async create(body) {
        const headers = await this.createHeaders();
        const options= {
            method: "POST",
            mode: "cors",
            headers: headers,
            body: JSON.stringify(body),
        };
        return await request(this.route, options);
    }

    /*
     * This is the implementation of the stub functions above. The stub functions are needed to give proper documentation with typescript
     */
    async get(arg1){
        let id = "";
        let query = undefined;
        // Overloaded function checks
        if (typeof arg1 === "string" || typeof arg1 === "number") {
            id = arg1  //it will be converted to a string below anyways if its a number
        } else {
            query = arg1 // similar to above comment
        }
        const headers = await this.createHeaders();
        const options= {
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
    async update(id, body) {
        const headers = await this.createHeaders();
        const options = {
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
    async delete(id) {
        const headers = await this.createHeaders();
        const options = {
            method: "DELETE",
            mode: "cors",
            headers: headers,
        };
        return await request(`${this.route}/${id}`, options);
    }

    /**
     * This function was made because token was getting caught as a string instead of null in the backend when it was null. it was "null"
     */
    createHeaders = async () => {
        const headers = {"Content-Type": "application/json"}
        const token = await localStorage.getItem("session");
        if (!token) {
            return headers;
        }
        headers.token = token;
        return headers
    }
}

export default Service;
