import mongoose from "mongoose";
import { env } from "../../config/env";

export async function connectMongo() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB just connected successfully 🎉");
  } catch (e: any) {
    console.error("MongoDB connection failed: ", e);
    process.exit(1); // fail fast to avoid running a broken system
  }
}
