import Router from "express";
import { jwtVerify } from "../middleware/auth.js";
import {
  approveDocument,
  getALL,
  rejectDocument,
  previewDocument,
  downloadDocument,
} from "../controller/documentController.js";
const router = Router();

router.get("/", getALL);
router.put("/approve/:id", jwtVerify, approveDocument);
router.put("/reject/:id", jwtVerify, rejectDocument);
router.get("/preview/:id", previewDocument);
router.get("/download/:id", downloadDocument);

export default router;
