import Router from "express";
import auth from "./auth.js";
import hr from "./hr.js";
import profileRoutes from "./profileRoutes.js"; // Import the new route file
import application from "./application.js";
import document from "./document.js";

const routes = Router();

routes.use("/auth", auth);
routes.use("/hr", hr);
routes.use("/profileRoutes", profileRoutes); // Add the profile routes
routes.use("/applications", application);
routes.use("/document", document);

export default routes;
