import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/eventdb", {
      // no extra options needed in mongoose 7+
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};