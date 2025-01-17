import mongoose from "mongoose";

// Schema for OnboardingApplication
const onboardingApplicationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // Status of the application
      default: "Pending",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    visaType: {
      type: String,
      enum: ["OPT", "H1-B", "L2", "H4", "Other"], // Visa type
      required: true,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Document model
        ref: "Document",
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create OnboardingApplication model
const OnboardingApplication = mongoose.model(
  "OnboardingApplication",
  onboardingApplicationSchema
);

export default OnboardingApplication;