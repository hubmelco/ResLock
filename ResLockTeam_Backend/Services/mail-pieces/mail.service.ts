import Mail from './mail.class'
import Building from '../buildings/building.class'
import express from 'express';
import { mailInfo, buildingInfo } from '../database-types';
import { privilege_level } from '../privilege-levels-enum';
import authenticate from '../../authentication'
import { getLogger } from 'log4js';

/**
 * Service for CRUD operations on mail table
 * @param app express application for server
 * @returns app with exposed endpoints
 * @author Roberto Garcia
 */
const MailService = (app: express.Application) => {
    const mail: Mail = new Mail();
    const building: Building = new Building();
    const logger = getLogger('MailService');

    // Create new Mailpiece
    app.post('/mail', authenticate(privilege_level.WORKER), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            if (!req.body.building_id || !req.body.is_letter || !req.body.email) return res.status(400).json({ error: "Required Fields Missing, building_id, is_letter, and email are required" });
            //Check if building exists and is in the same organization as the worker
            const foundBuilding = await building.getBuildingById(req.body.building_id)
            if (foundBuilding.length === 0) return res.status(400).json({ error: "Building not found" });
            if (foundBuilding[0].org_id != res.user.org_id) return res.status(401).json({ error: "You do not have permission to create a mail-piece for this organization" });
            // Set date related fields
            // const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const date = new Date();
            req.body.date_received = date
            req.body.date_picked_up = null;

            const results = await mail.createMail(req.body)
            // Successful Resource Created
            logger.info("Mail-Piece Created", { mail_id: results["insertId"], email: res.user.email, building_id: req.body.building_id, date_received: date });
            return res.status(201).json("Mail-Piece Created");
        } catch (err) {
            console.error(err);
            logger.error("Error Creating Mail-Piece", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Creating Mail-Piece" });
        };
    });


    // Read Mail-pieces
    app.get('/mail/:mail_id?', authenticate(privilege_level.RESIDENT), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // if (res.user.privilege < privilege_level.WORKER) return res.status(401).json({ error: "You cannot view other resident's Mailpieces" });

            // Typescript checking if it's a number
            let mail_id: number | null = req.params.mail_id ? Number(req.params.mail_id) : null;
            // Check to see if you're getting by ID or getting all
            if (mail_id) {
                if (isNaN(mail_id)) return res.status(400).json({ error: "Bad Request" });

                // Get one mailpiece by mail ID
                const results = await mail.getMailById(mail_id)
                if (results.length !== 0) {
                    if (results[0].email !== res.user.email) return res.status(401).json({ error: "You do not have permission to view this mailpiece" });
                }
                return res.status(200).json(results);
            } else if (Object.keys(req.query).length !== 0) {
                // Get all mailpieces for a user by user ID
                const results: mailInfo[] = await mail.get(req.query)
                if (results.length !== 0) {
                    if (results[0].email !== res.user.email) return res.status(401).json({ error: "You do not have permission to view this mailpiece" });
                }
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Incorrect URL Parameters" });
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Getting Mail-Piece", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Getting Mail-Piece" });
        };
    });

    // Update Mail-Piece
    app.put('/mail/:id', authenticate(privilege_level.WORKER), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Incorrect URL Parameters" });

            const results = await mail.updateMail(id, req.body)
            // Checking to see if there was nothing found in the DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Mailpiece not found" });
            } else {
                logger.info("Mail-Piece Updated", { mail_id: id, email: res.user.email })
                return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Updating Mail-Piece", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Updating Mail-Piece" });
        };
    });

    // Delete Mail-Piece
    app.delete('/mail/:mail_id', authenticate(privilege_level.WORKER), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.mail_id);
            if (isNaN(id)) return res.status(400).json({ error: "Incorrect URL Parameters" });

            // Try deleting the mail-piece
            const results = await mail.deleteMailById(id)
            // Checking to see if the ID was found in DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Mailpiece not found" });
            } else {
                logger.info("Mail-Piece Picked Up", { mail_id: id, email: res.user.email })
                return res.status(200).json("Removed " + results.affectedRows + " Row\(s\)");
            }

        } catch (err) {
            console.error(err);
            logger.error("Error Deleting Mail-Piece", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Deleting Mail-Piece" });
        };
    });
    return app;
}

export default MailService;