import { Router } from 'express';
import { getSuggestions } from './search.service';
import { publicSearchLimiter } from '../../middlewares/rateLimiter';

const router = Router();

// Rate limit: 20 requests per minute
const suggestionsLimiter = publicSearchLimiter;

/**
 * GET /api/search/suggestions?q=dha&context=donors
 * Returns up to 10 search suggestions based on actual database content.
 */
router.get('/suggestions', suggestionsLimiter, async (req, res, next) => {
  try {
    const q = (req.query.q as string) || '';
    const context = (req.query.context as string) || 'donors';

    if (!['donors', 'requests', 'organizations'].includes(context)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid context. Use: donors, requests, or organizations'
      });
    }

    const suggestions = await getSuggestions(
      q,
      context as 'donors' | 'requests' | 'organizations'
    );

    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
});

export const searchRouter = router;
