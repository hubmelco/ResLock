import Organization from './organization.class'
import express from 'express';
import authenticate from '../../authentication';
import { privilege_level } from '../privilege-levels-enum';
import { getLogger } from 'log4js';

/**
 * Service for CRUD operations on organization table
 * @param app express application for server
 * @returns app with exposed endpoints
 * @author Roberto Garcia
 */
const OrganizationService = (app: express.Application) => {
    const organization: Organization = new Organization();
    const logger = getLogger('OrganizationService');
    // Create new organization
    app.post('/organization', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            const results: any = await organization.createOrganization(req.body)
            // Successful Resource Created
            logger.info("Organization Created", { organization_id: results["insertId"], actor: res.user.email });
            return res.status(201).json({ message: "Organization Created" });

        } catch (err) {
            console.error(err);
            logger.error("Error Creating Organization", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Creating Organization" });
        }
    }
    );

    // Read organizations
    app.get('/organization/:org_id?', async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Typescript checking if it's a number
            let id: number | null = req.params.org_id ? Number(req.params.org_id) : null;
            // Check to see if you're getting by ID or getting all
            if (id) {
                if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
                // Getting by ID
                const results = await organization.getOrganizationById(id)
                // Checking to see if the ID was found in DB
                if (results.length === 0) {
                    return res.status(400).json({ error: "Organization not found" });
                } else {
                    return res.status(200).json(results);
                }

            } else if (Object.keys(req.query).length !== 0) {
                const results: any = await organization.get(req.query)
                return res.status(200).json(results);
            } else {
                // Getting All
                const results: any = await organization.getAllOrganizations()
                return res.status(200).json(results);
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Getting Organization", { actor: res.user.email, error: err })
            return res.status(500).json({ error: "Server Error Getting Organization" });
        }
    });

    // Update organization
    app.put('/organization/:id', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Bad Request" });

            const results: any = await organization.updateOrganization(id, req.body)
            // Checking to see if there was nothing found in the DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Organization not found" });
            } else {
                logger.info("Organization Updated", { organization_id: id, actor: res.user.email });
                return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Updating Organization", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Updating Organization" });
        }
    });

    // Delete organization
    app.delete('/organization/:org_id', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let id: number = Number(req.params.org_id);
            if (isNaN(id)) return res.status(400).json({ error: "Bad Request" });
            const results: any = await organization.deleteOrganizationById(id)
            // Checking to see if the ID was found in DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Organization not found" });
            } else {
                logger.info("Organization Deleted", { organization_id: id, actor: res.user.email });
                return res.status(200).json("Removed " + results.affectedRows + " Row\(s\)");
            }

        } catch (err) {
            console.error(err);
            logger.error("Error Deleting Organization", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Deleting Organization" });
        }
    });
    return app;
}

export default OrganizationService;