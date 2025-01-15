import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// connect to mongodb

const mongoURL = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected ...");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
