import { Router } from 'express';
import * as rewardController from './rewards.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', rewardController.getAvailableRewards);
router.post('/redeem', rewardController.redeemReward);
router.get('/my', rewardController.getMyRedeemedRewards);

export default router;
