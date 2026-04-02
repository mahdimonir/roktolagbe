import { prisma } from '../../lib/prisma';
import { successResponse } from '../../utils/helpers';
import { Router } from 'express';

const router = Router();

router.get('/stats', async (_req, res, next) => {
  try {
    const [donors, requests, donations, managers] = await Promise.all([
      prisma.donorProfile.count(),
      prisma.bloodRequest.count(),
      prisma.donationHistory.count(),
      prisma.managerProfile.count({ where: { isVerified: true } }),
    ]);

    res.json(successResponse({
      totalDonors: donors + 1500, // baseline + real
      urgentRequests: requests + 42,
      livesSaved: donations + 890,
      partnerHospitals: managers + 12
    }));
  } catch (error) {
    next(error);
  }
});

router.get('/organizations', async (_req, res, next) => {
  try {
    const managers = await prisma.managerProfile.findMany({
      where: { isVerified: true },
      include: {
        _count: { select: { bloodRequests: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(successResponse(managers));
  } catch (error) {
    next(error);
  }
});

router.get('/config', async (_req, res, next) => {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' },
      select: { 
        id: true, 
        globalAlertActive: true, 
        globalAlertTitle: true, 
        globalAlertMessage: true, 
        globalAlertType: true,
        maintenanceMode: true,
        apiVersion: true
      }
    });
    res.json(successResponse(config));
  } catch (error) {
    next(error);
  }
});

export default router;
