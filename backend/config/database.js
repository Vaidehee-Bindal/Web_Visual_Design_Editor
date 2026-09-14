import mongoose from "mongoose";

let connectionPromise;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Reuse an existing connection attempt
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri);
  }

  try {
    await connectionPromise;
    console.log("MongoDB connected");
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}