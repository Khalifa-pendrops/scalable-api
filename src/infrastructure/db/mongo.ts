import mongoose from "mongoose";
import { env } from "../../config/env";

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  try {
    await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 20, //  smaller pool = less contention locally
      minPoolSize: 5, // (or set to 5 if you want warm pool)
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
      socketTimeoutMS: 10000, // avoid long hangs impacting p95
    });

    isConnected = true;
    console.log("MongoDB just connected successfully 🎉");
  } catch (e: any) {
    console.error("MongoDB connection failed: ", e);
    process.exit(1);
  }
}
