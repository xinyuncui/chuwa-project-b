// server/model/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // e.g. "OPT Receipt" or "Resume"
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingApplication",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    step: {
      type: String, 
      required: true, 
    },
    feedback: {
      type: String,
      default: "",
    },
    uploadDate: {
      type: Date,
      required: true,
    },
    // === New fields to store file data directly in MongoDB
    fileData: {
      type: Buffer, // store binary data
      required: false, // or true if always must have data
    },
    fileContentType: {
      type: String,
      required: false,
    },
    versionHistory: [
      {
        version: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
        },
        feedback: { type: String },
        uploadDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;