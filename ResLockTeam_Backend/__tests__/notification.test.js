import { default as request } from "supertest";
import app from "../app";

jest.mock("../Services/notification/notification.class.ts");
jest.mock("../Services/db-service");
jest.mock("../Services/user/user.class.ts");


const idDP = [
    { email: 'test@test.com', expected: 200 },
    { email: 'failtest@test.com', expected: 401 }];
const updateIdDP = [
    { id: 1, expected: 200 },
    { id: 2, expected: 400 },
    { id: 3, expected: 500 }]
describe('Notification API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Creating a Notification', async () => {
        const response = await request(app)
            .post("/notification")
            .set("token", "valid")
            .send({
                to_email: "1",
                type: "test@test.com",
                content: 1,
            });
        expect(response.status).toBe(201);
    });

    it.each(idDP)("Getting Notication by Email", async ({ email, expected }) => {
        const response = await request(app)
            .get("/notification/" + email)
            .set("token", "valid,1");
        expect(response.status).toBe(expected);
    });

    it.each(updateIdDP)("Update Notification", async ({ id, expected }) => {
        const response = await request(app)
            .put("/notification/" + id)
            .set("token", "valid,0")
            .send({
                body: id,
            });
        expect(response.status).toBe(expected);
    });
    it.each(updateIdDP)("Delete Notification", async ({ id, expected }) => {
        const response = await request(app)
            .delete("/notification/" + id)
            .set("token", "valid")
        expect(response.status).toBe(expected);
    });
    afterAll(() => {
        jest.clearAllMocks();
        // connection.end();
    });
});