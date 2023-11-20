import { default as request } from "supertest";
// import connection from "../Services/db-service";
import app from "../app";

jest.mock("../Services/mail-pieces/mail.class");
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
describe('Mail API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Creating a Mailpiece', async () => {
        const response = await request(app)
            .post("/mail")
            .set("token", "valid")
            .send({
                is_letter: 1,
                email: "test@test.com",
                building_id: 1,
            });
        expect(response.status).toBe(201);
    });

    it.each(idDP)("Getting Mailpiece by Mail ID", async ({ id, expected }) => {
        const response = await request(app)
            .get("/mail/" + id)
            .set("token", "valid,3");
        expect(response.status).toBe(expected);
    });
    it("Getting Mailpiece by User", async () => {
        const response = await request(app)
            .get("/mail/?email=test@test.com")
            .set("token", "valid,3");
        expect(response.status).toBe(200);
    });
    it.each(updateIdDP)("Update Mailpiece", async ({ id, expected }) => {
        const response = await request(app)
            .put("/mail/" + id)
            .set("token", "valid,2")
            .send({
                mail_id: id,
            });
        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Delete Mailpiece", async ({ id, expected }) => {
        const response = await request(app)
            .delete("/mail/" + id)
            .set("token", "valid")
        expect(response.status).toBe(expected);
    });
    afterAll(() => {
        jest.clearAllMocks();
        // connection.end();
    });
});