import express from 'express';
import User from '../user/user.class';
import Google from './google.class'
import jwt from 'jsonwebtoken'
import { getLogger } from 'log4js';

const GoogleService = (app: express.Application) => {
    const google: Google = new Google();
    const user: User = new User();
    const logger = getLogger('GoogleService');

    // Google SSO
    app.get('/google', async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            const authCode: string = req.query.authCode;
            const codeVerifier: string = req.query.codeVerifier;

            let accessResponse = await google.getAccessToken(authCode, codeVerifier)

            // invalid authentication from Google
            if (accessResponse.error) {
                return res.status(401).json({ error: accessResponse });
            }

            let googleUser = await google.getGoogleUser(accessResponse.access_token)

            // valid Google account
            if (googleUser.verified_email) {

                const isUser = await user.getUser(googleUser.email)

                // invalid Reslock account
                if (isUser.length === 0) {
                    return res.status(300).json(googleUser);
                }

                // valid Reslock account
                const token = jwt.sign(isUser[0] as object, process.env.JWT_SECRET as string)
                return res.status(200).json({ token: token, user: isUser });
            }

            // invalid Google account
            return res.status(401).json({ error: user });
        } catch (err) {
            console.error(err);
            logger.error("Error Logging in with Google", { error: err });
            return res.status(500).json({ error: "Server Error" });
        }
    });

    return app;
}

export default GoogleService;