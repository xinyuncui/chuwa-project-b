import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    preferredName: { type: String, default: "" },
  },
  avatar: { type: String, default: "" },
  address: {
    building: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
  contactInfo: {
    cellPhone: { type: String, default: "" },
    workPhone: { type: String, default: "" },
  },
  email: { type: String, default: "" },
  ssn: { type: String, default: "" },
  birthDate: { type: String, default: "" },
  gender: { type: String, enum: ["Male", "Female", "Prefer not to say"] },
  residency: {
    isPermanentResidentOrCitizen: { type: Boolean, default: false },
    status: { type: String, default: "" },
    workAuthorization: {
      visaType: { type: String, default: "" },
      optReceipt: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
      otherVisaTitle: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
    },
  },
  reference: {
    name: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      middleName: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    relationship: { type: String, default: "" },
  },
  emergencyContacts: [
    {
      name: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        middleName: { type: String, default: "" },
      },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      relationship: { type: String, default: "" },
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    onboardingApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingApplication",
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    profile: {
      type: profileSchema,
      default: {
        name: {
          firstName: "",
          lastName: "",
          middleName: "",
          preferredName: "",
        },
        avatar: "",
        address: {
          building: "",
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        contactInfo: {
          cellPhone: "",
          workPhone: "",
        },
        email: "",
        ssn: "",
        birthDate: "",
        gender: "",
        residency: {
          isPermanentResidentOrCitizen: false,
          status: "",
          workAuthorization: {
            visaType: "",
            optReceipt: null,
            otherVisaTitle: "",
            startDate: "",
            endDate: "",
          },
        },
        reference: {
          name: {
            firstName: "",
            lastName: "",
            middleName: "",
          },
          phone: "",
          email: "",
          relationship: "",
        },
        emergencyContacts: [],
        documents: [],
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
