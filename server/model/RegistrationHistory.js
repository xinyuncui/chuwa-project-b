import mongoose from "mongoose";

const RegistrationHistorySechma = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    registrationLink: {
      type: String,
      required: true,
    },
    registrationStatus: {
      type: String,
      enum: ["unsubmitted", "submitted"],
      default: "unsubmitted",
    },
  },
  { timestamps: true }
);

const registrationHistory = mongoose.model(
  "RegistrationHistory",
  RegistrationHistorySechma
);

export default registrationHistory;
