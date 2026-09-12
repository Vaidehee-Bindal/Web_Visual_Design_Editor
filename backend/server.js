import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import canvasRoutes from './routes/canvases.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/canvases', canvasRoutes);
app.use(errorHandler);
const port = process.env.PORT || 4000;
connectDatabase().then(() => app.listen(port, () => console.log(`Canvasly API listening on ${port}`))).catch((error) => { console.error('Startup failed:', error.message); process.exit(1); });
