import { default as request } from "supertest";
// import connection from "../Services/db-service";
import app from "../app";

jest.mock("../Services/organization/organization.class");
jest.mock("../Services/db-service");

const tokenDP = [
    {
        token: "valid,0",
        expected: 201,
    },
    {
        token: "invalid,0",
        expected: 401,
    },
    {
        token: null,
        expected: 401,
    }
]

describe("Organizaton API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(tokenDP)("Create an organization with varying tokens", async ({ token, expected }) => {
        const response = await request(app)
            .post("/organization")
            .set("token", token)
            .send({
                org_id: "4",
                name: "Test Org",
            });
        expect(response.status).toBe(expected);
    });
    it("Get All Organizations", async () => {
        const response = await request(app)
            .get("/organization")
            .set("token", "valid,0");
        expect(response.status).toBe(200);
    });
    it("Get Organization by ID", async () => {
        const response = await request(app)
            .get("/organization/1")
            .set("token", "valid,0");
        expect(response.status).toBe(200);
    });
    it("Get Organization by ID not found", async () => {
        const response = await request(app)
            .get("/organization/2")
            .set("token", "valid,0");
        expect(response.status).toBe(400);
    });
    it("Update Organization succeed", async () => {
        const response = await request(app)
            .put("/organization/1")
            .set("token", "valid,0")
            .send({
                org_id: "1",
                name: "Test Org",
            });
        expect(response.status).toBe(200);
    });
    it("Update Organization fail", async () => {
        const response = await request(app)
            .put("/organization/2")
            .set("token", "valid,0")
            .send({
                org_id: "2",
                name: "Test Org",
            });
        expect(response.status).toBe(400);
    });
    it("Delete Organization", async () => {
        const response = await request(app)
            .delete("/organization/4")
            .set("token", "valid,0");
        expect(response.status).toBe(200);
    });

    afterAll(() => {
        jest.clearAllMocks();
        // connection.end();
    });
});