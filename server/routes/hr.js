import Router from "express";
import {
  hrSendEmail,
  getHistory,
  sendNotification,
} from "../controller/hrController.js";
import { jwtVerify } from "../middleware/auth.js";

const router = Router();
router.post("/send-registration-email", hrSendEmail);
router.get("/get-registration-history", jwtVerify, getHistory);
router.post("/send-notification-email", sendNotification);

export default router;
