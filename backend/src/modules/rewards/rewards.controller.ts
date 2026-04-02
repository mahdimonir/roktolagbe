import { Request, Response, NextFunction } from 'express';
import * as rewardService from './rewards.service';
import { successResponse } from '../../utils/helpers';

export const getAvailableRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rewards = await rewardService.getAvailableRewards();
    res.json(successResponse(rewards));
  } catch (error) {
    next(error);
  }
};

export const redeemReward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rewardId } = req.body;
    const userId = (req as any).user.id;
    const redeemed = await rewardService.redeemReward(userId, rewardId);
    res.json(successResponse(redeemed, 'Reward redeemed successfully! Check your vouchers.'));
  } catch (error) {
    next(error);
  }
};

export const getMyRedeemedRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const redeemed = await rewardService.getMyRedeemedRewards(userId);
    res.json(successResponse(redeemed));
  } catch (error) {
    next(error);
  }
};
