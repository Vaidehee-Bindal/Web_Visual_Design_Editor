import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import canvasRoutes from './routes/canvases.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const configuredOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({ origin: (origin, callback) => { let localDevelopmentOrigin = false; try { const parsedOrigin = origin ? new URL(origin) : null; localDevelopmentOrigin = !!parsedOrigin && (parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1'); } catch {} if (!origin || configuredOrigins.includes(origin) || localDevelopmentOrigin) return callback(null, true); return callback(new Error('Origin is not allowed')); } }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/canvases', canvasRoutes);
app.use(errorHandler);
const port = process.env.PORT || 4000;
connectDatabase().then(() => app.listen(port, () => console.log(`Canvasly API listening on ${port}`))).catch((error) => { console.error('Startup failed:', error.message); process.exit(1); });
