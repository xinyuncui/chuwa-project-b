import { Router } from "express";
import { login, refreshPage, signup } from "../controller/authController.js";

const router = Router();
router.post("/signup/:token", signup);
router.post("/login", login);
router.post("/refresh", refreshPage);


export default router;
