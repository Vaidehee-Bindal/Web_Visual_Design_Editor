import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, trim: true, maxlength: 200 },
    email: { type: String, trim: true, lowercase: true, maxlength: 320 },
    image: { type: String, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const User = mongoose.model("User", userSchema);
