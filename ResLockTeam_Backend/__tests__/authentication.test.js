import authenticate, { getToken } from "../authentication"

const testUser = { email: "test", password: "password", verified: false }

describe("Tests the getToken method", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should not return a token with a bad password", async () => {
        await expect(getToken({ email: testUser.email, password: "NOT VALID" }, testUser))
            .rejects.toBe("Email or Password is incorrect");
    });

    it("should return a token with matching passwords", async () => {
        const result = await getToken({ email: testUser.email, password: testUser.password }, testUser);
        expect(result).toHaveProperty("token");
        expect(result).toHaveProperty("expiration");
        expect(result.expiration).toBeInstanceOf(Date);
    })

});

describe("Tests the authenticate middleware", () => {
    let nextFunction = jest.fn();
    let mockRequest = {};
    let mockResponse = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => { return mockResponse }),
            json: jest.fn()
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should error when no token is passed in', async () => {
        mockRequest = {
            headers: {}
        }
        const innerFunction = authenticate(0);
        innerFunction(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toBeCalledWith(401);
        expect(mockResponse.json).toBeCalledWith("Not authorized for this action, try logging in");
    });

    it("should error if the token is not valid", () => {
        mockRequest = {
            headers: {
                token: "invalid"
            }
        }
        const innerFunction = authenticate(0);
        innerFunction(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toBeCalledWith(401);
        expect(mockResponse.json).toBeCalledWith("Invalid Authorization, try relogging");
    })

    it("should error if the user is not verified", () => {
        mockRequest = {
            headers: {
                token: "not verified"
            }
        }
        const innerFunction = authenticate(0);
        innerFunction(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toBeCalledWith(401);
        expect(mockResponse.json).toBeCalledWith("User is not verified");
    })

    it("should remove the user's password if authorized, before sending the data", () => {
        mockRequest = {
            headers: {
                token: "valid"
            }
        }
        const innerFunction = authenticate(0);
        innerFunction(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.user.password).toBeUndefined();
        expect(nextFunction).toBeCalledTimes(1);
    })
})
const authorizationDP = [
    { required: 1, privilege: 0, expected: 200 },
    { required: 1, privilege: 3, expected: 403 },
    { required: 1, privilege: 1, expected: 200 }
]

describe("Tests the authorization level", () => {
    let nextFunction = jest.fn();
    let mockRequest = {};
    let mockResponse = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => { return mockResponse }),
            json: jest.fn()
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it.each(authorizationDP)("Checking Admin Permissions", ({ required, privilege, expected }) => {
        if (expected === 200) {
            let innerFunction = authenticate(required);
            mockRequest = {
                headers: {
                    token: "valid," + privilege
                }
            }
            innerFunction(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toBeCalledTimes(1);
        } else {
            let innerFunction = authenticate(required);
            let mockRequest = {
                headers: {
                    token: "valid," + privilege
                },
            }
            innerFunction(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toBeCalledWith(expected);
            expect(mockResponse.json).toBeCalledWith("User does not have permission to perform this action");
        }
    })
})