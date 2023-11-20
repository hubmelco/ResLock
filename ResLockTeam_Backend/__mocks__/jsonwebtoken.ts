import { userInfo } from "../Services/database-types";
import { privilege_level } from "../Services/privilege-levels-enum";

const jwt: any = jest.createMockFromModule('jsonwebtoken');

const sign = (payload: object, secret: string): Promise<string> => {
    return Promise.resolve(JSON.stringify(payload) + secret);
}

const verify = (token: string, secret: string, callback: Function) => {
    let original_token = token.split(",")[0];
    let user_privilege = parseInt(token.split(",")[1]);
    let user: { email: string, first_name: string, last_name: string, password?: string, room: number, privilege?: number, org_id: number, building_id: number, verified: boolean } =
        { email: "test@test.com", first_name: "Test", last_name: "Smith", password: "random", room: 111, org_id: 1, building_id: 1, verified: true };
    if (user_privilege !== undefined) {
        user = { email: "test@test.com", first_name: "Test", last_name: "Smith", password: "random", room: 111, privilege: user_privilege, org_id: 1, building_id: 1, verified: true };
    }
    if (original_token === "not verified") {
        user.verified = false;
        original_token = "valid";
    }
    callback(original_token === "valid" ? undefined : "invalid token", user)
}
const decode = (token: string): object => {
    return { exp: new Date() };
}

jwt.sign = sign;

jwt.verify = verify;

jwt.decode = decode;

export default jwt;