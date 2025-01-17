// 引入 mongoose
import mongoose from "mongoose";

// 用户的个人信息子Schema
const profileSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true }, 
    middleName: { type: String },              
    preferredName: { type: String },            
  },
  avatar: { type: String, default: "" },         // Profile picture (optional)
  address: {
    building: { type: String },                  
    street: { type: String },                   
    city: { type: String },                    
    state: { type: String },                     
    zip: { type: String },                       
  },
  contactInfo: {
    cellPhone: { type: String, required: true }, // Cell phone number (required)
    workPhone: { type: String },                
  },
  email: { type: String, required: true },       // Email (required, pre-filled at registration)
  ssn: { type: String, required: true },         // SSN (required)
  birthDate: { type: Date, required: true },     // Date of birth (required)
  gender: {
    type: String,
    enum: ["Male", "Female", "I do not wish to answer"], // Gender (required)
    required: true,
  },
  residency: {                                    
    isPermanentResidentOrCitizen: { type: Boolean, required: true }, 
    status: {                                     
      type: String,
      enum: ["Green Card", "Citizen"],
    },
    workAuthorization: {                          
      visaType: {                                 
        type: String,
        enum: ["H1-B", "L2", "F1(CPT/OPT)", "H4", "Other"],
      },
      optReceipt: { type: mongoose.Schema.Types.ObjectId, ref: "Document" }, // Reference to OPT Receipt document
      otherVisaTitle: { type: String },           
      startDate: { type: Date },                 
      endDate: { type: Date },                    
    },
  },
  reference: {                                  
    name: {
      firstName: { type: String, required: true }, // First name (required)
      lastName: { type: String, required: true },  // Last name (required)
      middleName: { type: String },               // Middle name (optional)
    },
    phone: { type: String, required: true },       
    email: { type: String, required: true },       
    relationship: { type: String, required: true }, 
  },
  emergencyContacts: [                          
    {
      name: {
        firstName: { type: String, required: true }, 
        lastName: { type: String, required: true },  
        middleName: { type: String },            
      },
      phone: { type: String, required: true },       
      email: { type: String },                     
      relationship: { type: String, required: true }, 
    },
  ],
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Email format validation
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"], // Password length validation
    },
    role: {
      type: String,
      enum: ["HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    onboardingApplication: {
      type: mongoose.Schema.Types.ObjectId, // Reference to onboarding application
      ref: "OnboardingApplication",
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to document
        ref: "Document",
      },
    ],
    profile: profileSchema, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;