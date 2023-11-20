import { default as request } from "supertest";
import app from "../app";

jest.mock("../Services/user/user.class");
jest.mock("../Services/buildings/building.class");
jest.mock("../Services/db-service");

const idDP = [
    { id: 1, expected: 200 },
    { id: 2, expected: 200 },
    { id: 3, expected: 500 }]
const updateIdDP = [
    { id: 1, expected: 200 },
    { id: 2, expected: 400 },
    { id: 3, expected: 500 }]
describe('User API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(idDP)("Get User by Email", async ({ id, expected }) => {
        const response = await request(app)
            .get("/user/" + id)
            .set("token", "valid");
        expect(response.status).toBe(expected);
    });
    it.each(idDP)("Get User With Params", async ({ id, expected }) => {
        const response = await request(app)
            .get("/user/?test=" + id)
            .set("token", "valid");

        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Update User", async ({ id, expected }) => {
        const response = await request(app)
            .put("/user/" + id)
            .set("token", "valid,0")
            .send({
                email: id,
                first_name: "Test",
                last_name: "Test",
                password: "test",
                room: 123,
                privilege: 0,
                org_id: 1,
                building_id: 1,
                verified: false
            });
        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Delete User", async ({ id, expected }) => {
        const response = await request(app)
            .delete("/user/" + id)
            .set("token", "valid")
        expect(response.status).toBe(expected);
    });
    afterAll(() => {
        jest.clearAllMocks();
        // connection.end();
    });
});