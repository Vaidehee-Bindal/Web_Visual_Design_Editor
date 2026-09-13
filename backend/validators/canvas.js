import { z } from 'zod';

const element = z.object({
  id: z.string().min(1).max(100), type: z.enum(['rectangle', 'circle', 'text', 'line', 'curve']), lineStyle: z.enum(['straight', 'curved', 'elbow']).optional(),
  x: z.number().finite(), y: z.number().finite(), rotation: z.number().finite().default(0),
  fill: z.string().regex(/^#[0-9a-fA-F]{6}$/), width: z.number().positive().optional(),
  height: z.number().positive().optional(), radius: z.number().positive().optional(),
  text: z.string().max(500).optional(), fontSize: z.number().positive().max(200).optional(),
  stroke: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), strokeWidth: z.number().min(0).max(50).optional(),
  opacity: z.number().min(0).max(1).optional(), strokeEnabled: z.boolean().optional(), points: z.array(z.number().finite()).max(100).optional(),
  fontFamily: z.string().max(80).optional(), fontStyle: z.enum(['normal', 'bold', 'italic', 'bold italic']).optional(),
  textDecoration: z.enum(['none', 'underline', 'line-through', 'underline line-through']).optional(), align: z.enum(['left', 'center', 'right']).optional(),
});
export const canvasInput = z.object({
  name: z.string().trim().min(1).max(80), width: z.number().int().min(320).max(2400),
  height: z.number().int().min(240).max(1600), elements: z.array(element).max(500),
});
export const canvasCreateInput = z.object({
  name: z.string().trim().min(1).max(80).optional(), width: z.number().int().min(320).max(2400),
  height: z.number().int().min(240).max(1600), elements: z.array(element).max(500),
});
