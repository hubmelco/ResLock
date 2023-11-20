import express from "express";
import authenticate from "../../authentication";
import multer from "multer"
import fs from "fs"
import { privilege_level } from '../privilege-levels-enum';
import { getLogger } from 'log4js';

// This sets up multer which allows files to be sent which i struggled with for a good 12341257231-7 hours and then found multer
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const uploads = multer({ storage, fileFilter })

/**
 * Service to send use the Microsoft Cognitive Services API to read text from an image
 *
 * @param app the express application for the server
 * @returns express app with endpoints exposed
 * @author Jonathan Her
 */
const OCRService = (app: express.Application) => {
    const logger = getLogger('OCRService');


    /**
     * Reads the data of the image passed in and sends it to the microsoft service
     * images are NOT saved (technically they are saved as binaries in TEMP folders hidden somewhere which are probably deleted). dont hate me rob please :(
     * needs 'authenticate' in the post but removing it helps for testing right now
    */
    app.post("/ocr", authenticate(privilege_level.WORKER), uploads.single('profile'), async (req: express.Request, res: express.Response, next: express.Next) => {
        try {
            fs.readFile(req.file.path, async (err, data) => {
                if (err) {
                    return res.status(500).json("Couldn't read the image data")
                }
                //TODO Can change/add params later if needed or add more post routes for different capabilities
                const url: string = process.env.AZURE_COGNITIVE_SERVICES_ENDPOINT + "computervision/imageanalysis:analyze?api-version=2022-10-12-preview&features=read";
                const resp = await fetch(url, {
                    method: "POST",
                    credentials: "omit",
                    //@ts-ignore type error weird thing with env variables being string | undefined
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Ocp-Apim-Subscription-Key": process.env.AZURE_COGNITIVE_SERVICES_KEY
                    },
                    //TODO Replace with body variable once tested with the frontend
                    body: data

                })
                const json = await resp.json()
                return res.status(resp.status).json(json)
            })
        } catch (error) {
            console.error(error)
            logger.error("Error Reading Image", { actor: res.user.email, error: error })
            return res.status(500).json({ error: error });
        }

    });

    return app;

};

export default OCRService;