import Router from "express";
import auth from "./auth.js";
import hr from "./hr.js";

const routes = Router();

routes.use("/auth", auth);
routes.use("/hr", hr);

export default routes;
