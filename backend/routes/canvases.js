import { Router } from 'express';
import { listCanvases, getCanvas, createCanvas, updateCanvas, deleteCanvas } from '../controllers/canvasController.js';
const router = Router();
router.get('/', listCanvases); router.post('/', createCanvas); router.get('/:id', getCanvas); router.put('/:id', updateCanvas); router.delete('/:id', deleteCanvas);
export default router;
