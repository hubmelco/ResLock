import { default as request } from "supertest";
// import connection from "../Services/db-service";
import app from "../app";

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
describe('Building API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Creating a Building', async () => {
        const response = await request(app)
            .post("/building")
            .set("token", "valid")
            .send({
                building_id: "1",
                org_id: "1",
                name: "Test Building",
                address: "123 Test St"
            });
        expect(response.status).toBe(201);
    });

    it.each(idDP)("Get Building by ID", async ({ id, expected }) => {
        const response = await request(app)
            .get("/building/" + id);
        expect(response.status).toBe(expected);
    });
    it.each(idDP)("Get Building by Org_ID", async ({ id, expected }) => {
        const response = await request(app)
            .get("/building/?org_id=" + id);
        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Update Building", async ({ id, expected }) => {
        const response = await request(app)
            .put("/building/" + id)
            .set("token", "valid")
            .send({
                org_id: "Test Org",
                name: "Test Building",
                addr: "123 Test St"
            });
        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Delete Building", async ({ id, expected }) => {
        const response = await request(app)
            .delete("/building/" + id)
            .set("token", "valid")
        expect(response.status).toBe(expected);
    });
    afterAll(() => {
        jest.clearAllMocks();
        // connection.end();
    });
});