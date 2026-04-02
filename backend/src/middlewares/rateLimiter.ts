import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: 'Too many requests, please try again in a minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many search requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
