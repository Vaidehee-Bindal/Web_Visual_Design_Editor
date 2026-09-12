import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['rectangle', 'circle', 'text'], required: true },
  x: { type: Number, required: true }, y: { type: Number, required: true },
  width: Number, height: Number, radius: Number, rotation: { type: Number, default: 0 },
  fill: { type: String, required: true }, text: String, fontSize: Number,
}, { _id: false, strict: true });

const canvasSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  width: { type: Number, required: true, min: 320, max: 2400 },
  height: { type: Number, required: true, min: 240, max: 1600 },
  elements: { type: [elementSchema], default: [] },
}, { timestamps: true });

export const Canvas = mongoose.model('Canvas', canvasSchema);
