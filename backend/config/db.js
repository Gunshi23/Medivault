import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medivault";
  try {
    console.log("Connecting to MongoDB at:", mongoUri);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Local MongoDB connection failed/unavailable. Starting MongoMemoryServer fallback...");
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Connected to MongoMemoryServer at ${uri}`);
    } catch (memErr) {
      console.error("Failed to start MongoMemoryServer:", memErr.message);
      process.exit(1);
    }
  }
}
