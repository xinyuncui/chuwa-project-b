import Router from "express";
import { getPersonalInfo, updatePersonalInfo } from "../controller/profileController.js";
import { jwtVerify } from "../middleware/auth.js"; // Correct middleware import

const router = Router();

// Route to fetch personal information
router.get("/profile", jwtVerify, getPersonalInfo);

// Route to update personal information
router.put("/profile", jwtVerify, updatePersonalInfo);

export default router;