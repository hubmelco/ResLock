import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { userInfo } from './Services/database-types'

/**
 * Authentication middleware using JWT's
 *
 * @author Jonathan Her
 * @param required_level The minimum privilege level required to access the endpoint
 * @returns status An error is sent on failure or the next middleware runs
 */
const authenticate = (required_level: number = 0) => {
    return (req, res, next) => {
        // Get the user's token
        const token = req.headers?.token;
        if (!token) {
            // The token doesn't exist so the user is not logged in
            return res.status(401).json("Not authorized for this action, try logging in");
        }
        // Verify that the token is valid
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                // The token may have expired or been modified
                return res.status(401).json("Invalid Authorization, try relogging");
            }
            // The token was valid, append the user to the response for permission level checking and move on
            if (!user.verified) return res.status(401).json("User is not verified");
            // Remove the user's password before sending it to other middleware to use
            delete user.password;
            res.user = user;
            if (user.privilege > required_level) return res.status(403).json("User does not have permission to perform this action");
            next();
        })
    }
}

export default authenticate;

/**
 * Creates a JWT for a user that is logging on for the first time. The login information must match an existing user
 *
 * @author Jonathan Her
 * @param login: {email: string, password: string} inputted information from the user
 * @param user: {userInfo} user information from the database
 * @returns string|null A JWT is returned upon successful login otherwise null
 */
export const getToken = async (login: { email: string, password: string }, user: userInfo): Promise<any> => {
    try {
        const validPassword = await confirmPassword(login.password, user.password as string)
        if (!validPassword) throw new Error("Invalid Password")
        const token: string = jwt.sign(user as object, process.env.JWT_SECRET as string, { expiresIn: '1h' } as object);
        const decodedToken: JwtPayload = jwt.decode(token) as JwtPayload;
        const expiration = new Date(decodedToken.exp! as number * 1000);
        console.log(typeof token, typeof expiration)
        return { token: token, expiration: expiration };
    } catch (error) {
        return Promise.reject("Email or Password is incorrect");
    }
}

export const getTokenTemp = async (email: string, user: userInfo): Promise<string> => {
    try {
        return jwt.sign(user as object, process.env.JWT_SECRET as string);
    } catch (error) {
        return Promise.reject("Issue getting temporary token");
    }
}
// Helper Functions

/**
 * Compares an inputted password to the actual password
 *
 * @author Jonathan Her
 * @param input inputted password string
 * @param password a password to compare to the input
 * @returns Promise<boolean> true if the passwords match otherwise false or error.
 */
const confirmPassword = (input: string, password: string): Promise<boolean> => {
    return bcrypt.compare(input, password);
}
