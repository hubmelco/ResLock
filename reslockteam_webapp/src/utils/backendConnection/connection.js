import App from "./app";

// Create a connection app to the backend
const app = new App();

// set up all the services we will need and export them to be used everywhere
export const userService = app.service("user");
export const orgService = app.service("organization");
export const buildingService = app.service("building");
export const mailService = app.service("mail");
export const superAdminService = app.service("user-admin");
export const residentUploadService = app.service("resident-upload");

// export the app to be used everywhere
export default app;
