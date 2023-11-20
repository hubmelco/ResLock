import Notification from './notification.class'
import express from 'express';
import authenticate from '../../authentication';
import { privilege_level } from '../privilege-levels-enum';
import { getLogger } from 'log4js';
import User from '../user/user.class';
import { userInfo } from '../database-types';

/**
 * Service for CRUD operations on organization table
 * @param app express application for server
 * @returns app with exposed endpoints
 * @author Roberto Garcia
 */
const NotificationService = (app: express.Application) => {
    const notification: Notification = new Notification();
    const user = new User();
    const logger = getLogger('NotificationService');
    // Create new notification
    app.post('/notification', authenticate(privilege_level.RESIDENT), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Checks if all the required fields are there
            if (!req.body.to_email || !req.body.type || !req.body.content) return res.status(400).json({ error: "Required Fields Missing, to_email, from_email, type, and content are required" });

            // Check if the user exists and is an admin or above
            let result: userInfo[] = await user.getUser(req.body.to_email)
            if (result.length === 0) return res.status(400).json({ error: "User not found" });
            if (result[0].privilege > privilege_level.ADMIN) return res.status(401).json({ error: "You can only send notifications to admins or above" });

            // Seperate the notification headers from the content
            const notification_headers = { to_email: req.body.to_email, from_email: res.user.email, type: req.body.type };
            const results: any = await notification.createNotification(notification_headers, req.body.content)

            // Successful Resource Created
            logger.info("Notification Created", { notification_id: results["insertId"], actor: res.user.email });
            return res.status(201).json({ message: "Notification Created" });

        } catch (err: any) {
            // Check if the error is because of an invalid to_email or from_email
            const foreignKeyError = 1452;
            if (err.errno === foreignKeyError) return res.status(400).json({ error: "Invalid Sender or Receiver Email" });
            console.error(err);
            logger.error("Error Creating Notification", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Creating Notification" });
        }
    }
    );

    // Read notification
    app.get('/notification/:email?', authenticate(privilege_level.RESIDENT), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Typescript checking if it's a number
            const email: string | null = req.params.email;
            // Check if you sent an email
            if (email) {
                // Check if the email is the same as the one in the token unless super admin
                if (res.user.email !== email) return res.status(401).json({ error: "Unauthorized" });
                let results: any = null;
                if (res.user.privilege > privilege_level.ADMIN) {
                    // Getting all pending notifications being sent FROM that email
                    results = await notification.residentGetNotifications(email);
                } else {
                    // Getting all notifications being sent TO that email
                    results = await notification.getNotification(email)
                }
                // Return notifications
                return res.status(200).json(results);
            } else {
                // No Email
                return res.status(400).json({ error: "Bad Request" });
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Getting Notification", { actor: res.user.email, error: err })
            return res.status(500).json({ error: "Server Error Getting Notification" });
        }
    });

    // Update notification
    app.put('/notification/:id', authenticate(privilege_level.ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Bad Request" });
            
            const results: any = await notification.updateNotification(id, req.body)
            // Checking to see if there was nothing found in the DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Notification not found" });
            } else {
                logger.info("Notification Updated", { notification_id: id, actor: res.user.email });
                return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Updating Notification", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Updating Notification" });
        }
    });

    // Delete notification
    app.delete('/notification/:id', authenticate(privilege_level.ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Bad Request" });
            const results: any = await notification.deleteNotificationById(id)
            // Checking to see if the ID was found in DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Notification not found" });
            } else {
                logger.info("Notification Deleted", { notification_id: id, actor: res.user.email });
                return res.status(200).json("Removed " + results.affectedRows + " Row\(s\)");
            }

        } catch (err) {
            console.error(err);
            logger.error("Error Deleting Notification", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Deleting Notification" });
        }
    });
    return app;
}

export default NotificationService;