import mongoose from "mongoose";

const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    lineStyle: { type: String, enum: ["straight", "curved", "elbow"] },
    type: {
      type: String,
      enum: ["rectangle", "circle", "text", "line", "curve"],
      required: true,
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: Number,
    height: Number,
    radius: Number,
    rotation: { type: Number, default: 0 },
    fill: { type: String, required: true },
    stroke: String,
    strokeWidth: Number,
    strokeEnabled: Boolean,
    opacity: Number,
    points: [Number],
    text: String,
    fontSize: Number,
    fontFamily: String,
    fontStyle: String,
    textDecoration: String,
    align: String,
  },
  { _id: false, strict: true },
);

const canvasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    nameKey: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      select: false,
    },
    width: { type: Number, required: true, min: 320, max: 2400 },
    height: { type: Number, required: true, min: 240, max: 1600 },
    elements: { type: [elementSchema], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Canvas = mongoose.model("Canvas", canvasSchema);
