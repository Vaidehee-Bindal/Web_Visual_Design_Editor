import { Router } from "express";
import {
  listCanvases,
  getCanvas,
  createCanvas,
  updateCanvas,
  deleteCanvas,
  restoreCanvas,
  permanentlyDeleteCanvas,
} from "../controllers/canvasController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.use(requireAuth);
router.get("/", listCanvases);
router.post("/", createCanvas);
router.get("/:id", getCanvas);
router.put("/:id", updateCanvas);
router.post("/:id/restore", restoreCanvas);
router.delete("/:id", deleteCanvas);
router.delete("/:id/permanent", permanentlyDeleteCanvas);
export default router;
