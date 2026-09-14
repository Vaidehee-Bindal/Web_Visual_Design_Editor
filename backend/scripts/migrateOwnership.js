import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Canvas } from "../models/Canvas.js";

const legacyUserId = process.env.LEGACY_USER_ID;
if (!legacyUserId) throw new Error("Set LEGACY_USER_ID to the Google subject of the account that should own existing canvases");

await mongoose.connect(process.env.MONGODB_URI);
await User.updateOne({ _id: legacyUserId }, { $setOnInsert: { _id: legacyUserId } }, { upsert: true });
try { await Canvas.collection.dropIndex("nameKey_1"); } catch (error) { if (error.codeName !== "IndexNotFound") throw error; }
const result = await Canvas.updateMany({ userId: { $exists: false } }, { $set: { userId: legacyUserId } });
await Canvas.collection.createIndex({ userId: 1, nameKey: 1 }, { unique: true });
await Canvas.collection.createIndex({ userId: 1, updatedAt: -1 });
console.log(`Assigned ${result.modifiedCount} legacy canvas(es) to ${legacyUserId}`);
await mongoose.disconnect();
