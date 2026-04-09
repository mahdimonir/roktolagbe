import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { adminRouter } from './modules/admin/admin.routes';
import statsRouter from './modules/admin/stats.routes';
import { authRouter } from './modules/auth/auth.routes';
import { bloodRequestRouter } from './modules/blood-requests/blood-requests.routes';
import { donorRouter } from './modules/donors/donors.routes';
import { managerRouter } from './modules/managers/managers.routes';
import { mediaRouter } from './modules/media/media.routes';
import { messageRouter } from './modules/messages/messages.routes';
import { notificationRouter } from './modules/notifications/notifications.routes';
import rewardsRouter from './modules/rewards/rewards.routes';
import { searchRouter } from './modules/search/search.routes';
import { aiRouter } from './modules/ai/ai.routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  // origin: true,
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/donors', donorRouter);
app.use('/api/managers', managerRouter);
app.use('/api/blood-requests', bloodRequestRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/messages', messageRouter);
app.use('/api/public', statsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);

// Welcome
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🩸 Welcome to the RoktoLagbe API',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: '🩸 RoktoLagbe API v1 is active and routing correctly.',
    documentation: 'Access endpoints via /api/*'
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
