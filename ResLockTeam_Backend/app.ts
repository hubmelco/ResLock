import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OrgService from "./Services/organization/organization.service";
import UserService from "./Services/user/user.service";
import SessionService from "./Services/session/session.service";
import BuildingService from "./Services/buildings/building.service"
import MailService from "./Services/mail-pieces/mail.service"
import VerificationService from "./Services/verification/verification.service"
import OCRService from "./Services/ocr/ocr.service"
import GoogleService from "./Services/google/google.service"
import ResidentUploadService from "./Services/resident-upload/resident-upload.service"
import UserAdminService from "./Services/superadmin-services/user.service"
import NotificationService from "./Services/notification/notification.service"
import log4js from 'log4js';
// This could allow for json logs
// log4js.addLayout("json", function (config) {
//     return function (logEvent) {
//       return JSON.stringify(logEvent) + config.separator;
//     };
//   });

// Make sure the logs directory exists
try {
  require('fs').mkdirSync('./logs');
} catch (e: any) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}
log4js.configure('./log_config.json');

const app = express();
dotenv.config();

app.use("/", express.static('public'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Opens up endpoints for the db
const organizationService = OrgService(app);
const userService = UserService(app);
const sessionService = SessionService(app);
const buildingService = BuildingService(app);
const mailService = MailService(app);
const verificationService = VerificationService(app);
const ocrService = OCRService(app);
const googleService = GoogleService(app);
const residentUploadService = ResidentUploadService(app);
const userAdminService = UserAdminService(app);
const notificationService = NotificationService(app);
export default app;