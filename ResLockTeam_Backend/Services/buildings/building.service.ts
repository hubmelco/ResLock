import Building from './building.class'
import express from 'express';
import { buildingInfo } from '../database-types';
import { privilege_level } from '../privilege-levels-enum';
import authenticate from '../../authentication';
import { getLogger } from 'log4js';
/**
 * Service for CRUD operations on building table
 * @param app express application for server
 * @returns app with exposed endpoints
 * @author Miriam John
 */
const BuildingService = (app: express.Application) => {
    const building: Building = new Building();
    const logger = getLogger('BuildingService');
    // Create new building
    app.post('/building', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Check if super admin is creating a building for their org
            if (res.user.org_id != req.body.org_id) return res.status(401).json({ error: "You do not have permission to create a building for this organization" });
// Create building
            const results = await building.createBuilding(req.body)
            // Successful Resource Created
            logger.info("Building Created", { building_id: results["insertId"], actor: res.user.email, org_id: req.body.org_id });
            return res.status(201).json("Building Created");

        } catch (err) {
            console.error(err);
            logger.error("Error creating building", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error" });
        }
    });

    // Read building
    app.get('/building/:building_id?', async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Typescript checking if it's a number
            let building_id: number | null = req.params.building_id ? Number(req.params.building_id) : null;
            // Check to see if you're getting by org ID or by name or getting all
            if (building_id) {
                const results = await building.getBuildingById(building_id)
                return res.status(200).json(results);
            } else if (Object.keys(req.query).length !== 0) { //can get any field in the building table by 
                //filtering with another field (for example getting the addresses of buildings only in org 1)
                const results: buildingInfo[] = await building.buildingLookUp(req.query)
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Bad request Parameters" });
            }
        } catch (err) {
            console.error(err);
            logger.error("Error Reading Building", { query: req.query, error: err });
            return res.status(500).json({ error: "Server Error" });
        }
    });

    // Update building
    app.put('/building/:building_id', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let building_id: number = Number(req.params.building_id);
            if (isNaN(building_id)) return res.status(400).json({ error: "Bad Request" });
            // Check if building exists before updating
            const foundBuilding = await building.getBuildingById(building_id)
            if (foundBuilding.length === 0) return res.status(400).json({ error: "Building not found" });

            // Check if super admin is updating a building for their org
            if (res.user.org_id != foundBuilding[0].org_id) return res.status(401).json({ error: "You do not have permission to update a building for this organization" });

            // Update building
            const results = await building.updateBuildingId(req.params.building_id, req.body)
            // Checking to see if there was nothing found in the DB
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: "Building not found" });
            } else {
                logger.info("Building Updated", { building_id: req.params.building_id, actor: res.user.email, org_id: foundBuilding[0].org_id });
                return res.status(200).json("Updated " + results.affectedRows + " Row\(s\)");
            }
        } catch (err) {
            console.error(err);
            logger.error("Error updating building", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error" });
        }
    });

    // Delete building
    app.delete('/building/:building_id', authenticate(privilege_level.SUPER_ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            let building_id: number = Number(req.params.building_id);
            if (isNaN(building_id)) return res.status(400).json({ error: "Bad Request" });

            // Check if building exists before updating
            const foundBuilding = await building.getBuildingById(building_id)
            if (foundBuilding.length === 0) return res.status(400).json({ error: "Building not found" });

            // Check if super admin is updating a building for their org
            if (res.user.org_id != foundBuilding[0].org_id) return res.status(401).json({ error: "You do not have permission to update a building for this organization" });
            if (building_id) {
                // Delete building
                const results = await building.deleteBuildingById(building_id)
                // Checking to see if the ID was found in DB
                if (results.affectedRows === 0) {
                    return res.status(400).json({ error: "Building not found" });
                } else {
                    logger.info("Building Deleted", { building_id: req.params.building_id, actor: res.user.email, org_id: foundBuilding[0].org_id });
                    return res.status(200).json("Removed " + results.affectedRows + " Row\(s\)");
                }

            } else {
                return res.status(400).json({ error: "Bad request params" })
            }
        } catch (err) {
            console.error(err);
            logger.error("Error updating building", { actor: res.user.email, error: err });
            return res.status(500).json({ error: "Server Error Deleting Building" });
        }
    })
    return app;
}

export default BuildingService;