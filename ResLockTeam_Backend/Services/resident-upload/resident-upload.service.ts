import express from 'express';
import { privilege_level } from '../privilege-levels-enum';
import ResidentUpload from './resident-upload.class';
import authenticate from '../../authentication';
import Building from '../buildings/building.class';
import { getLogger } from 'log4js';
/**
 * Service for CRUD operations on user table
 *
 * @param app the express application for the server
 * @returns express app with endpoints exposed
 * @author Roberto Garcia
 */
const ResidentUploadService = (app: express.Application) => {
    const building: Building = new Building();
    const residentUpload = new ResidentUpload();
    const logger = getLogger('ResidentUploadService');

    // Create new user
    app.post('/resident-upload', authenticate(privilege_level.ADMIN), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            // Expected input with optional fields marked with ?
            type Resident = [{ first_name: string, last_name: string, email: string, building_id: number, room: string, org_id?: number }]

            // Get the body of the request
            let residents: Resident = req.body;

            // Require all fields
            if (!residents.every((resident) => { return resident.first_name && resident.last_name && resident.email && resident.building_id && resident.room })) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            let allowed_building_ids: Set<number> = new Set();
            if (res.user.privilege === privilege_level.SUPER_ADMIN) {
                // If the user is a super admin, they can add residents to any building in the org
                let allowed_buildings = await building.getBuildingsByOrgId(res.user.org_id)
                allowed_building_ids = new Set(allowed_buildings.map((building) => { return building.building_id; }))
            } else {
                // If the user is an admin, they can only add residents to their building
                allowed_building_ids = new Set([res.user.building_id]);
            }

            // Filter out the residents that can be added
            let residents_not_added = residents.filter((resident) => {
                return !allowed_building_ids.has(resident.building_id);
            });

            if (residents_not_added.length > 0) {
                return res.status(403).json({ rejected: residents_not_added });
            } else {
                let default_residents = residents.map((resident) => ({ ...resident, org_id: res.user.org_id }));
                residentUpload.addUsers(default_residents).then((results) => {
                    logger.info(`Added ${results.affectedRows} residents`, { actor: res.user.email, org_id: res.user.org_id });
                    return res.status(200).json("Added All Residents");
                }).catch((err) => {
                    return res.status(400).json({ error: err });
                });
            }

        } catch (err) {
            console.error(err);
            logger.error("Error Adding Residents", { actor: res.user.email, error: err });
            return res.status(500).json("Server Error Adding Residents");
        }
    });
    return app;
}

export default ResidentUploadService;