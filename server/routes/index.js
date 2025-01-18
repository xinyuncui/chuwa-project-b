import Router from "express";
import auth from "./auth.js";
import hr from "./hr.js";
import profileRoutes from "./profileRoutes.js"; // Import the new route file

const routes = Router();

routes.use("/auth", auth);
routes.use("/hr", hr);
routes.use("/profileRoutes", profileRoutes); // Add the profile routes

export default routes;