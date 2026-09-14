import mongoose from "mongoose";
import { Canvas } from "../models/Canvas.js";
import { canvasInput, canvasCreateInput } from "../validators/canvas.js";

const validId = (id) => mongoose.isValidObjectId(id);
const nameKey = (name) => name.trim().toLocaleLowerCase();
const activeFilter = () => ({ deletedAt: null });
async function assertUniqueName(userId, name, excludeId) {
  const query = { userId, nameKey: nameKey(name) };
  if (excludeId) query._id = { $ne: excludeId };
  if (await Canvas.exists(query)) { const error = new Error("A canvas with this name already exists"); error.statusCode = 409; throw error; }
}
async function nextDefaultName(userId) {
  const names = await Canvas.find({ userId }, { name: 1 }).lean();
  const used = new Set(names.map((item) => nameKey(item.name)));
  let number = 1;
  while (used.has("untitled canvas " + number)) number += 1;
  return "Untitled Canvas " + number;
}
export async function listCanvases(req, res, next) {
  try {
    const filter = req.query.view === "trash" ? { userId: req.user._id, deletedAt: { $ne: null } } : { userId: req.user._id, ...activeFilter() };
    res.json(await Canvas.find(filter).sort({ updatedAt: -1 }).select("name width height elements updatedAt createdAt deletedAt"));
  } catch (error) { next(error); }
}
export async function getCanvas(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid canvas id" });
    const doc = await Canvas.findOne({ _id: req.params.id, userId: req.user._id, ...activeFilter() });
    if (!doc) return res.status(404).json({ error: "Canvas not found" });
    res.json(doc);
  } catch (error) { next(error); }
}
export async function createCanvas(req, res, next) {
  try {
    const input = canvasCreateInput.parse(req.body);
    let attempts = 0;
    while (attempts++ < 3) {
      const name = input.name || await nextDefaultName(req.user._id);
      try { return res.status(201).json(await Canvas.create({ ...input, userId: req.user._id, name, nameKey: nameKey(name), deletedAt: null })); }
      catch (error) { if (error?.code !== 11000 || input.name) throw error; }
    }
    const error = new Error("Unable to allocate a unique canvas name"); error.statusCode = 409; throw error;
  } catch (error) { next(error); }
}
export async function updateCanvas(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid canvas id" });
    const input = canvasInput.parse(req.body);
    await assertUniqueName(req.user._id, input.name, req.params.id);
    const doc = await Canvas.findOneAndUpdate({ _id: req.params.id, userId: req.user._id, ...activeFilter() }, { ...input, nameKey: nameKey(input.name) }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: "Canvas not found" });
    res.json(doc);
  } catch (error) { next(error); }
}
export async function deleteCanvas(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid canvas id" });
    const doc = await Canvas.findOneAndUpdate({ _id: req.params.id, userId: req.user._id, ...activeFilter() }, { deletedAt: new Date() }, { new: true });
    if (!doc) return res.status(404).json({ error: "Canvas not found" });
    res.json(doc);
  } catch (error) { next(error); }
}
export async function restoreCanvas(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid canvas id" });
    const doc = await Canvas.findOneAndUpdate({ _id: req.params.id, userId: req.user._id, deletedAt: { $ne: null } }, { deletedAt: null }, { new: true });
    if (!doc) return res.status(404).json({ error: "Canvas not found in trash" });
    res.json(doc);
  } catch (error) { next(error); }
}
export async function permanentlyDeleteCanvas(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid canvas id" });
    const doc = await Canvas.findOneAndDelete({ _id: req.params.id, userId: req.user._id, deletedAt: { $ne: null } });
    if (!doc) return res.status(404).json({ error: "Canvas not found in trash" });
    res.status(204).send();
  } catch (error) { next(error); }
}
