import Router from "express";
import { jwtVerify } from "../middleware/auth.js";
import {
  ApproveApplication,
  getALLApplicationStatus,
  RejectApplication,
} from "../controller/applicationStatusController.js";

const router = new Router();

router.get("/", jwtVerify, getALLApplicationStatus);
router.post("/approve/:id", jwtVerify, ApproveApplication);
router.post("/reject/:id", jwtVerify, RejectApplication);

export default router;
