import User from '../user/user.class'
import Building from '../buildings/building.class'
import express from 'express';
import bcrypt from "bcrypt"
import { userInfo, buildingInfo } from '../database-types';
import { privilege_level } from '../privilege-levels-enum';
import authenticate from '../../authentication';
import { getLogger } from 'log4js';
/**
 * Service for CRUD operations on user table
 *
 * @param app the express application for the server
 * @returns express app with endpoints exposed
 * @author Roberto Garcia
 */
const UserAdminService = (app: express.Application) => {
    const user: User = new User();
    const building: Building = new Building();
    const logger = getLogger('UserAdminService');

    // Create new user
    app.post('/user-admin', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Check if user is creating a user for their org
            if (res.user.org_id !== req.body.org_id) return res.status(401).json({ error: "You are not part of that organization" });

            // Check if user is creating a user with a lower or equal privilege level
            if (req.body.privilege <= res.user.privilege) return res.status(401).json({ error: "Cannot create account of higher or equal authorization" });

            // Check if the building is in the org
            const user_building: buildingInfo[] = await building.getBuildingById(req.body.building_id);
            if (user_building[0].org_id !== req.body.org_id) return res.status(401).json({ error: "User's building is not part of the organization" });

            // Sets password to null
            req.body["password"] = null;
            // Create the user
            user.createUser(req.body).then((results: JSON) => {
                logger.info("Super Admin Created User", { user_id: results["insertId"], actor: res.user.email })
                // New Resource created
                return res.status(201).json("User Created");
            });
        } catch (err) {
            console.error(err);
            logger.error("Error Creating User", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Creating User" });
        }
    }
    );

    // Read users
    app.get('/user-admin/:email?', authenticate(privilege_level.SUPER_ADMIN), (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            const email: string | null = req.params.email;
            const org_id: number = res.user.org_id;
            // Check if you're looking for an ID or trying to get them by other parameters
            if (email) {
                // Getting user by ID
                user.getUserRestricted(email, org_id).then((results: userInfo[]) => {
                    return res.status(200).json(results);
                });
                // Check if you're trying to get them by other parameters
            } else if (Object.keys(req.query).length !== 0) {
                req.query["org_id"] = org_id;
                user.userLookUp(req.query).then((results: userInfo[]) => {
                    return res.status(200).json(results);
                });
            } else {
                // Bad Request
                return res.status(400).json({ error: "Bad Request" });
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Getting User", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Reading User(s)" });
        }
    });

    // Update user
    app.put('/user-admin/:email', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        let userInfo: userInfo[];
        try {
            // Check if updating a building of their own org
            if (res.user.privilege === privilege_level.ADMIN && req.body.building_id) {
                let user_building = await building.getBuildingById(req.body.building_id);
                if (user_building[0].org_id !== res.user.org_id) return res.status(401).json({ error: "That building is not part of your organization" })
            }

            if (req.body.privilege !== undefined && req.body.privilege <= res.user.privilege) return res.status(401).json({ error: "Cannot update account to higher or equal authorization" });


            // Try and get the user
            let current_user = await user.getUser(req.params.email)

            // If the user exists, merge the current user with the new user
            if (current_user) {
                // Check if user is updating a user for their org
                if (res.user.org_id !== current_user[0].org_id) return res.status(401).json({ error: "You are not part of that organization" });
                if (res.user.privilege >= current_user[0].privilege) return res.status(401).json({ error: "Cannot Update a Super Admin" });
                req.body = { ...current_user[0], ...req.body }
            } else {
                // If the user doesn't exist, return an error
                return res.status(400).json({ error: "User not found" });
            }

            // If there isn't a password, user the req.body password and hash it
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            user.updateUser(req.params.email, req.body)
                .then((results: { affectedRows: Number }) => {
                    // Checking if there were any results, if there weren't there is no user with that ID
                    if (results.affectedRows === 0) {
                        return res.status(400).json({ error: "User not found" });
                    } else {
                        logger.info("Super Admin Updated User", { user_id: req.params.email, actor: res.user.email })
                        return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
                    }
                });
        } catch (err) {
            console.error(err);
            logger.error("Error Updating User", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Updating User" });
        }
    });

    // Delete user
    app.delete('/user-admin/:email', authenticate(privilege_level.SUPER_ADMIN), (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let email: string = req.params.email;
            user.getUser(email).then((results: userInfo[]) => {
                if (results.length === 0) return res.status(400).json({ error: "User not found" });
                // Check if user is deleting a user for their org
                if (res.user.org_id !== results[0].org_id) return res.status(401).json({ error: "You are not part of that organization" });

                // Check if user is deletiung a user with a lower or equal privilege level
                if (results[0].privilege <= res.user.privilege) return res.status(401).json({ error: "Cannot delete account of higher or equal authorization" });

                user.deleteUser(email).then((results: { affectedRows: Number }) => {
                    // Checks if there's a user with that email
                    if (results.affectedRows === 0) {
                        return res.status(400).json({ error: "User not found" });
                    } else {
                        logger.info("Super Admin Deleted User", { user_id: req.params.email, actor: res.user.email })
                        return res.status(200).json("Removed " + results.affectedRows + " Row\(s\)");
                    }
                })
            });
        } catch (err) {
            console.error(err);
            logger.error("Error Deleting User", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Deleting User" });
        }
    });
    return app;
}

export default UserAdminService;