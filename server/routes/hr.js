import Router from "express";
import { hrSendEmail } from "../controller/hrController.js";

const router = Router();
router.post("/send-registration-email", hrSendEmail);

export default router;
