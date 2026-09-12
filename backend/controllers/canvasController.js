import mongoose from 'mongoose';
import { Canvas } from '../models/Canvas.js';
import { canvasInput } from '../validators/canvas.js';

function validId(id) { return mongoose.isValidObjectId(id); }
function parsed(body) { return canvasInput.parse(body); }

export async function listCanvases(_req, res, next) { try { res.json(await Canvas.find().sort({ updatedAt: -1 }).select('name width height updatedAt createdAt')); } catch (e) { next(e); } }
export async function getCanvas(req, res, next) { try { if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid canvas id' }); const doc = await Canvas.findById(req.params.id); if (!doc) return res.status(404).json({ error: 'Canvas not found' }); res.json(doc); } catch (e) { next(e); } }
export async function createCanvas(req, res, next) { try { const doc = await Canvas.create(parsed(req.body)); res.status(201).json(doc); } catch (e) { next(e); } }
export async function updateCanvas(req, res, next) { try { if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid canvas id' }); const doc = await Canvas.findByIdAndUpdate(req.params.id, parsed(req.body), { new: true, runValidators: true }); if (!doc) return res.status(404).json({ error: 'Canvas not found' }); res.json(doc); } catch (e) { next(e); } }
export async function deleteCanvas(req, res, next) { try { if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid canvas id' }); const doc = await Canvas.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ error: 'Canvas not found' }); res.status(204).send(); } catch (e) { next(e); } }
