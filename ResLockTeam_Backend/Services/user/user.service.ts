import User from './user.class'
import express from 'express';
import bcrypt from "bcrypt"
import { userInfo } from '../database-types';
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
const UserService = (app: express.Application) => {
  const user: User = new User();
  const logger = getLogger('UserService');

  // Read users
  app.get('/user/:email?', authenticate(privilege_level.WORKER), async (req: express.Request, res: express.Response, next: express.Next) => {
    try {
      const email: string | null = req.params.email;
      const org_id: number = res.user.org_id;
      // Check if you're looking for an ID or trying to get them by other parameters
      if (email) {
        // Getting user by ID
        const results = await user.getUserRestricted(email, org_id)
        return res.status(200).json(results);

        // Check if you're trying to get them by other parameters
      } else if (Object.keys(req.query).length !== 0) {
        req.query["org_id"] = org_id;
        if (res.user.privilege !== privilege_level.SUPER_ADMIN) req.query["verified"] = true;
        const results: userInfo[] = await user.userLookUp(req.query)
        return res.status(200).json(results);
      } else {
        // Bad Request
        return res.status(400).json({ error: "Bad Request" });
      }
    } catch (err) {
      console.error(err);
      logger.error("Error Reading Users", { actor: res.user.email, error: err });
      return res.status(500).json({ error: "Server Error Reading Users" });
    }
  });

  // Update user
  app.put('/user/:email', authenticate(privilege_level.RESIDENT), async (req: express.Request, res: express.Response, next: express.Next) => {
    try {
      let userInfo: userInfo[];

      if (res.user.org_id !== req.body.org_id) return res.status(401).json({ error: "You are not part of that organization" });
      // Check if they're a resident
      if (res.user.privilege >= privilege_level.WORKER) {
        // Check if they're trying to update themselves
        if (res.user.email !== req.params.email) return res.status(401).json({ error: "This is not your account" });
        userInfo = await user.getUser(req.params.email);
        // Check if they exist and aren't verified (this would mean they're trying to set up their account with a password)
        if (userInfo.length === 0) return res.status(400).json({ error: "User not found" });
        if (!userInfo[0].verified) return res.status(401).json({ error: "Not Verified" });
        if (userInfo[0].registered) return res.status(401).json({ error: "Password already set" });
        req.body.registered = true;
      }
      // Hash the password the user inputs
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const results = await user.updateUser(req.params.email, req.body)
      // Checking if there were any results, if there weren't there is no user with that ID
      if (results.affectedRows === 0) {
        return res.status(400).json({ error: "User not found" });
      } else {
        logger.info("User Updated", { actor: res.user.email, target: req.params.email })
        return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
      }
    } catch (err) {
      console.error(err);
      logger.error("Error Updating User", { actor: res.user.email, error: err });
      return res.status(500).json({ error: "Server Error Updating User" });
    }
  });

  // Delete user
  app.delete('/user/:email', authenticate(privilege_level.ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
    try {
      let email: string = req.params.email;
      // Check if user is deleting a user for their building
      const results = await user.getUser(email)
      if (results.length === 0) return res.status(400).json({ error: "User not found" });
      // Check if user is deleting a user for their org
      if (res.user.org_id !== results[0].org_id) return res.status(401).json({ error: "You are not part of that organization" });

      // Check if user is deletiung a user with a lower or equal privilege level
      if (results[0].privilege <= res.user.privilege) return res.status(401).json({ error: "Cannot delete account of higher or equal authorization" });

      // If the user is an admin, check if they are deleting a user for their building
      if (res.user.privilege === privilege_level.ADMIN && res.user.building_id !== req.body.building_id) return res.status(401).json({ error: "User is not part of your assigned building" });

      const sqlResults: any = user.deleteUser(email)
      // Checks if there's a user with that email
      if (sqlResults.affectedRows === 0) {
        return res.status(400).json("User not found");
      } else {
        return res.status(200).json("Removed " + sqlResults.affectedRows + " Row\(s\)");
      }
    } catch (err) {
      console.error(err);
      logger.error("Error Deleting User", { actor: res.user.email, error: err });
      return res.status(500).json("Server Error Deleting User");
    }
  });
  return app;
}

export default UserService;