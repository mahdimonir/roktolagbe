import { Router } from 'express';
import { getHelpResponse } from './ai.service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limit: 10 requests per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please wait a moment before asking again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/ai/help
 * Get an AI-powered response to a help question.
 * Body: { question: string }
 */
router.post('/help', aiLimiter, async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question with at least 3 characters.',
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Question is too long. Please keep it under 500 characters.',
      });
    }

    const result = await getHelpResponse(question.trim());

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const aiRouter = router;
