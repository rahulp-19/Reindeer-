import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import categoryRoutes from './routes/categories.js';
import announcementRoutes from './routes/announcements.js';
import planRoutes from './routes/plans.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'development-only-change-me';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');

app.use((req, _res, next) => {
  if (req.originalUrl === '/api/payments/webhooks/stripe') {
    express.raw({ type: 'application/json' })(req, _res, (err) => {
      req.rawBody = req.body;
      next(err);
    });
  } else {
    express.json({ limit: '2mb' })(req, _res, next);
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Blocked by CORS'))), credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250, standardHeaders: true, legacyHeaders: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h', etag: true }));

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'StreamVault API', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`StreamVault running on http://localhost:${port}`));
