import { Router } from "express";
import {
  getPersonalInfo,
  updatePersonalInfo,
  uploadDocument,
  getAllPersonalInfo,

} from "../controller/profileController.js";
import { jwtVerify } from "../middleware/auth.js";
import multer from "multer";

// We'll store file in memory as Buffer first
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // up to 10MB, for example
  fileFilter: (req, file, cb) => {
    // Only accept pdf or word documents
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word documents are allowed."));
    }
  },
});

const router = Router();

// GET personal info
router.get("/profile", jwtVerify, getPersonalInfo);

// PUT update personal info
router.put("/profile", jwtVerify, updatePersonalInfo);

// POST upload Document
router.post(
  "/profile/uploadDocument",
  jwtVerify,
  upload.single("document"), // the field name in your formData is "document"
  uploadDocument
);


// GET all personal info
router.get("/all-user", jwtVerify, getAllPersonalInfo);

// DELETE a user

export default router;

