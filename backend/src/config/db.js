import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/thinkquiz";
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
