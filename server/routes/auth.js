import { Router } from "express";
import { login, signup } from "../controller/authController.js";

const router = Router();
router.post("/signup/:token", signup);
router.post("/login", login);

export default router;
