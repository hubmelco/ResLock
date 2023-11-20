import express from "express";
import { getToken } from "../../authentication";
import User from "../user/user.class";
import Mail from "../mail-pieces/mail.class";
import { mailInfo } from "../database-types";
import jwt from "jsonwebtoken"

/**
 * Service for getting JWT tokens and authentication
 *
 * @param app the express application for the server
 * @returns express app with endpoints exposed
 * @author Roberto Garcia
 */
const SessionService = (app: express.Application) => {

    /**
     * Validates the login information and sends back a JWT token for session use
     */
    app.post('/session', async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            const userService: User = new User();
            const mailService: Mail = new Mail();

            const token = req.headers.token
            if (!token) {
                // Regular log in with email and password
                const login: { email: string, password: string } = { email: req.body.email, password: req.body.password };
                try {
                    const [user] = await userService.getUser(login.email);
                    if (!user) {
                        return res.status(400).json({ error: "Invalid email or password" }) //BAD EMAIL
                    }
                    if (!user.verified) {
                        return res.status(400).json({ error: "User is not verified" }) // NOT VERIFIED, CANT LOGIN
                    }
                const tokenDetails: { token: string, expiration: Date } = await getToken(login, user);
                const token = tokenDetails.token;
                const expiration = tokenDetails.expiration;
                    //Remove the users password before sending the user to the frontend
                    delete user.password

                    // Get all the users letters and packages
                    const mail: mailInfo[] = await mailService.get({ email: user.email });
                    user.mail = mail;
                    // Send the user and token back to the frontend
                return res.status(201).json({ token: token, expiration: expiration, user: user });
                } catch (error) {
                    return res.status(400).json({ error: error });
                }
            }

            // If the user sends a token header, use their token to log in autonmatically
            jwt.verify(req.headers.token, process.env.JWT_SECRET as string, async (err, user) => {
                if (err) {
                    // The token may have expired or been modified
                    return res.status(401).json({ error: "Invalid Authorization cant auto log in" });
                }
                // Remove the user's password before sending it to other middleware to use
                delete user.password;
                const mail: mailInfo[] = await mailService.get({ email: user.email });
                user.mail = mail;

                return res.status(201).json({ token: req.headers.token, user: user });
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    });
    return app;
}

export default SessionService;