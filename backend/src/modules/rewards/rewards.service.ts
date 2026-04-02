import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import crypto from 'crypto';

export const getAvailableRewards = async () => {
  return prisma.reward.findMany({
    where: { isActive: true },
    orderBy: { pointsCost: 'asc' },
  });
};

import { logAction } from '../audit/audit.service';
import { createNotification } from '../notifications/notifications.service';

export const redeemReward = async (userId: string, rewardId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Get reward info
    const reward = await tx.reward.findUnique({ where: { id: rewardId } });
    if (!reward || !reward.isActive) throw new AppError('Reward not found or inactive', 404);

    // 2. Get donor profile (points)
    const donor = await tx.donorProfile.findUnique({ where: { userId } });
    if (!donor) throw new AppError('Only donors can redeem rewards', 403);
    if (donor.points < reward.pointsCost) throw new AppError('Insufficient points. Keep donating!', 400);

    // 3. Deduct points
    await tx.donorProfile.update({
      where: { userId },
      data: { points: { decrement: reward.pointsCost } },
    });

    // 4. Create redeemed reward (voucher)
    const voucherCode = `RK-${reward.category.substring(0, 3).toUpperCase()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    
    return tx.redeemedReward.create({
      data: {
        userId,
        rewardId,
        voucherCode,
      },
      include: { reward: true },
    });
  });

  // Audit Log (Institutional Tracking)
  await logAction(userId, 'REWARD_REDEEM', 'REWARD', result.id, { 
    rewardName: result.reward.title,
    voucherCode: result.voucherCode 
  });

  // Notify Donor
  await createNotification(
    userId,
    'REWARD_REDEEMED',
    `You have successfully redeemed ${result.reward.title}! Check "The Vault" for your secure voucher code.`
  );

  return result;

};

export const getMyRedeemedRewards = async (userId: string) => {
  return prisma.redeemedReward.findMany({
    where: { userId },
    include: { reward: true },
    orderBy: { redeemedAt: 'desc' },
  });
};
