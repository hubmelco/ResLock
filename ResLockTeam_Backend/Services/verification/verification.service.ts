import { sendOTP, setPassword, verifyOTP } from './verification.class';
import User from '../user/user.class';
import express from 'express';
import { getLogger } from 'log4js';

const VerificationService = (app: express.Application) => {
    const user: User = new User();
    const logger = getLogger('VerificationService');

    // Verify OTP
    app.post('/verifyOTP', async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            verifyOTP(req.body.otp).then((results: object) => {
                return res.status(200).json(results);
            }).catch((err: any) => {
                if (err.message) return res.status(400).json({error: err});
                return res.status(500).json(err);
            });
        } catch (err) {
            console.error(err);
            logger.error("Error Verifying OTP", { error: err });
            return res.status(500).json("Server Error Verifying OTP");
        }
    });
    // Verify OTP
    app.post('/changePassword', (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            setPassword(req.body.otp, req.body.password).then((results: object) => {
                return res.status(200).json(results);
            }).catch((err: any) => {
                if (err.message) return res.status(400).json({ error: err });
                return res.status(500).json({ error: err });
            });
        } catch (err) {
            console.error(err);
            logger.error("Error Verifying OTP", { error: err });
            return res.status(500).json("Server Error Verifying OTP");
        }
    });
    // Send OTP
    app.post('/sendOTP', (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            user.getUser(req.body.email).then((results: any) => {
                if (results.length === 0) return res.status(400).json({ error: "User not found" });
                if (results[0].verified) return res.status(400).json({ error: "User already verified" });
                sendOTP(req.body.email).then((results: any) => {
                    return res.status(200).json({ sent: true });
                }).catch((err: Error) => {
                    return res.status(500).json({ error: err });
                });
            }).catch((err: Error) => {
                return res.status(500).json({ error: err });
            });
        } catch (err) {
            console.error(err);
            logger.error("Error Verifying OTP", { error: err });
            return res.status(500).json("Server Error Sending OTP");
        }
    });
    return app;
}
export default VerificationService;