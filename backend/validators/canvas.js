import { z } from 'zod';

const element = z.object({
  id: z.string().min(1).max(100), type: z.enum(['rectangle', 'circle', 'text']),
  x: z.number().finite(), y: z.number().finite(), rotation: z.number().finite().default(0),
  fill: z.string().regex(/^#[0-9a-fA-F]{6}$/), width: z.number().positive().optional(),
  height: z.number().positive().optional(), radius: z.number().positive().optional(),
  text: z.string().max(500).optional(), fontSize: z.number().positive().max(200).optional(),
});
export const canvasInput = z.object({
  name: z.string().trim().min(1).max(80), width: z.number().int().min(320).max(2400),
  height: z.number().int().min(240).max(1600), elements: z.array(element).max(500),
});
