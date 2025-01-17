// Import mongoose
import mongoose from "mongoose";

// Schema for Document
const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // Document type (e.g., OPT Receipt, OPT EAD, etc.)
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
      required: true,
    },
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to OnboardingApplication model
      ref: "OnboardingApplication",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // Current document status
      default: "Pending",
      required: true,
    },
    step: {
      type: String, // Step of the visa process (e.g., OPT Receipt)
      required: true,
    },
    feedback: {
      type: String, // Feedback from HR for the document
      default: "",
    },
    uploadDate: {
      type: Date, // Date when the document was uploaded
      required: true,
    },
    versionHistory: [
      {
        version: { type: Number, required: true }, // Version number of the document
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"], // Status of the version
        },
        feedback: { type: String }, // Feedback for the version
        uploadDate: { type: Date, required: true }, // Upload date of the version
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create Document model
const Document = mongoose.model("Document", documentSchema);

export default Document;