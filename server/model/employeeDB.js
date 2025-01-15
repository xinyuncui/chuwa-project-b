import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Employee", employeeSchema);

export default User;
