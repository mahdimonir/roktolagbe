import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { getPagination, paginatedResponse, successResponse } from '../../utils/helpers';
import { logAction } from './audit.service';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (page: number, limit: number, role?: string) => {
  const { skip, take } = getPagination(page, limit);
  const where = role ? { role: role as any } : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip, take, where,
      select: { id: true, email: true, phone: true, role: true, isVerified: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return paginatedResponse(users, total, page, limit);
};

export const createUser = async (actorId: string, data: any) => {
  const { email, password, phone, role } = data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 400);
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { email, phone, role, passwordHash, isVerified: true }
  });

  await logAction(actorId, 'CREATE', 'USER', user.id, { email, role });
  return user;
};

export const getAllDonations = async (page: number, limit: number) => {
  const [donations, total] = await Promise.all([
    prisma.donationHistory.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { donor: { include: { user: true } }, request: true },
      orderBy: { donatedAt: 'desc' },
    }),
    prisma.donationHistory.count(),
  ]);
  return paginatedResponse(donations, total, page, limit);
};

export const updateUser = async (actorId: string, userId: string, data: any) => {
  const user = await prisma.user.update({ where: { id: userId }, data });
  await logAction(actorId, 'UPDATE', 'USER', userId, data);
  return user;
};

export const deleteUser = async (actorId: string, userId: string) => {
  const user = await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  await logAction(actorId, 'DELETE', 'USER', userId, { note: 'Soft delete/Deactivate' });
  return user;
};

export const toggleUserBan = async (actorId: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Cannot ban admin accounts', 403);
  
  const updated = await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  await logAction(actorId, 'BAN', 'USER', userId, { newState: updated.isActive });
  return updated;
};

export const getAllManagers = async (page: number, limit: number, verified?: string, search?: string) => {
  const { skip, take } = getPagination(page, limit);
  
  let isVerified: boolean | undefined = undefined;
  if (verified === 'VERIFIED' || verified === 'true') isVerified = true;
  else if (verified === 'PENDING' || verified === 'false') isVerified = false;

  const where: any = {};
  if (isVerified !== undefined) where.isVerified = isVerified;
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { district: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [managers, total] = await Promise.all([
    prisma.managerProfile.findMany({
      skip, take, where,
      include: {
        user: { select: { email: true, isActive: true } },
        _count: { select: { members: true, bloodRequests: true } },
      },
      orderBy: { isVerified: 'asc' }, // Verified first, or swap to createdAt
    }),
    prisma.managerProfile.count({ where }),
  ]);
  return paginatedResponse(managers, total, page, limit);
};

export const createManager = async (actorId: string, data: any) => {
  const { email, password, name, type, district, contactPhone } = data;
  const passwordHash = await bcrypt.hash(password, 10);
  // Create user first
  const user = await prisma.user.create({
    data: { email, role: 'MANAGER', passwordHash, isVerified: true }
  });
  // Create manager profile
  const manager = await prisma.managerProfile.create({
    data: { userId: user.id, name, type, district, contactPhone, isVerified: true }
  });

  await logAction(actorId, 'CREATE', 'MANAGER', manager.id, { name, type });
  return manager;
};

export const updateManager = async (actorId: string, managerId: string, data: any) => {
  const manager = await prisma.managerProfile.update({ where: { id: managerId }, data });
  await logAction(actorId, 'UPDATE', 'MANAGER', managerId, data);
  return manager;
};

export const deleteManager = async (actorId: string, managerId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { id: managerId } });
  if (!manager) throw new AppError('Manager not found', 404);
  
  const res = await prisma.user.delete({ where: { id: manager.userId } });
  await logAction(actorId, 'DELETE', 'MANAGER', managerId, { note: 'Hard delete manager/user' });
  return res;
};

export const toggleManagerVerification = async (actorId: string, managerId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { id: managerId } });
  if (!manager) throw new AppError('Manager not found', 404);
  const updated = await prisma.managerProfile.update({ where: { id: managerId }, data: { isVerified: !manager.isVerified } });
  await logAction(actorId, 'VERIFY', 'MANAGER', managerId, { newState: updated.isVerified });
  return updated;
};

export const getAllRequests = async (page: number, limit: number, status?: string) => {
  const { skip, take } = getPagination(page, limit);
  const where = status ? { status: status as any } : {};
  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      skip, take, where,
      include: { manager: { select: { name: true, type: true, district: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bloodRequest.count({ where }),
  ]);
  return paginatedResponse(requests, total, page, limit);
};

export const getAnalytics = async () => {
  const [
    totalDonors,
    availableDonors,
    totalManagers,
    verifiedManagers,
    openRequests,
    fulfilledRequests,
    totalDonations,
    rawDonations,
    bloodGroupStats,
  ] = await Promise.all([
    prisma.donorProfile.count(),
    prisma.donorProfile.count({ where: { isAvailable: true } }),
    prisma.managerProfile.count(),
    prisma.managerProfile.count({ where: { isVerified: true } }),
    prisma.bloodRequest.count({ where: { status: 'OPEN' } }),
    prisma.bloodRequest.count({ where: { status: 'FULFILLED' } }),
    prisma.donationHistory.count(),
    // Recent 30 days trends
    prisma.donationHistory.findMany({
      where: { donatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { donatedAt: true },
      orderBy: { donatedAt: 'asc' },
    }),
    // Blood group distribution
    prisma.donorProfile.groupBy({
      by: ['bloodGroup'],
      _count: { _all: true },
    })
  ]);

  // Aggregate trends by day
  const trends: { date: string; count: number }[] = [];
  const trendMap: Record<string, number> = {};
  rawDonations.forEach(d => {
    const date = d.donatedAt.toISOString().split('T')[0];
    trendMap[date] = (trendMap[date] || 0) + 1;
  });
  
  Object.entries(trendMap).forEach(([date, count]) => {
    trends.push({ date, count });
  });

  // Map blood group stats
  const bloodGroups = bloodGroupStats.map(stat => ({
    group: stat.bloodGroup.replace('_POS', '+').replace('_NEG', '-'),
    count: stat._count._all,
  }));

  return successResponse({
    donors: { total: totalDonors, available: availableDonors, distribution: bloodGroups },
    managers: { total: totalManagers, verified: verifiedManagers },
    requests: { open: openRequests, fulfilled: fulfilledRequests },
    donations: { total: totalDonations, trends },
    resolutionRate: openRequests + fulfilledRequests === 0
      ? 0
      : Math.round((fulfilledRequests / (openRequests + fulfilledRequests)) * 100),
  });
};

export const getSystemConfig = async () => {
  let config = await prisma.systemConfig.findUnique({ where: { id: 'singleton' } });
  if (!config) {
    config = await prisma.systemConfig.create({
      data: { id: 'singleton', globalAlertActive: false, apiVersion: '1.4.2' }
    });
  }
  return config;
};

export const updateSystemConfig = async (actorId: string, data: any) => {
  const config = await prisma.systemConfig.upsert({
    where: { id: 'singleton' },
    create: { ...data, id: 'singleton' },
    update: data,
  });
  await logAction(actorId, 'CONFIG_CHANGE', 'CONFIG', 'singleton', data);
  return config;
};

export const deleteDonation = async (actorId: string, donationId: string) => {
  const res = await prisma.donationHistory.delete({ where: { id: donationId } });
  await logAction(actorId, 'DELETE', 'DONATION', donationId, { note: 'Admin data cleaning' });
  return res;
};

export const getUserDetail = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      donorProfile: {
        include: {
          donations: { orderBy: { donatedAt: 'desc' }, take: 10 },
          badges: { include: { badge: true } },
        }
      },
      managerProfile: true,
      notifications: { orderBy: { createdAt: 'desc' }, take: 5 },
    }
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const getManagerDetail = async (managerId: string) => {
  const manager = await prisma.managerProfile.findUnique({
    where: { id: managerId },
    include: {
      user: { select: { email: true, isActive: true, createdAt: true } },
      bloodRequests: { orderBy: { createdAt: 'desc' }, take: 20 },
      inventory: true,
      _count: { select: { members: true, bloodRequests: true } },
    }
  });
  if (!manager) throw new AppError('Manager not found', 404);
  return manager;
};

export const createRequest = async (actorId: string, data: any) => {
  const req = await prisma.bloodRequest.create({ data });
  await logAction(actorId, 'CREATE', 'REQUEST', req.id, { hospital: data.hospitalName });
  return req;
};

export const updateRequest = async (actorId: string, id: string, data: any) => {
  const req = await prisma.bloodRequest.update({ where: { id }, data });
  await logAction(actorId, 'UPDATE', 'REQUEST', id, data);
  return req;
};

export const deleteRequest = async (actorId: string, id: string) => {
  const req = await prisma.bloodRequest.delete({ where: { id } });
  await logAction(actorId, 'DELETE', 'REQUEST', id);
  return req;
};

export const getAllRewards = async () => {
  return prisma.reward.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { redeemedBy: true } } }
  });
};

export const createReward = async (actorId: string, data: any) => {
  const reward = await prisma.reward.create({ data });
  await logAction(actorId, 'CREATE', 'REWARD', reward.id, { title: data.title });
  return reward;
};

export const updateReward = async (actorId: string, id: string, data: any) => {
  const reward = await prisma.reward.update({ where: { id }, data });
  await logAction(actorId, 'UPDATE', 'REWARD', id, data);
  return reward;
};

export const deleteReward = async (actorId: string, id: string) => {
  const reward = await prisma.reward.delete({ where: { id } });
  await logAction(actorId, 'DELETE', 'REWARD', id);
  return reward;
};

export const getAllBadges = async () => {
  return prisma.badge.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createBadge = async (actorId: string, data: any) => {
  const badge = await prisma.badge.create({ data });
  await logAction(actorId, 'CREATE', 'BADGE', badge.id, { name: data.name });
  return badge;
};

export const updateBadge = async (actorId: string, id: string, data: any) => {
  const badge = await prisma.badge.update({ where: { id }, data });
  await logAction(actorId, 'UPDATE', 'BADGE', id, data);
  return badge;
};

export const deleteBadge = async (actorId: string, id: string) => {
  const badge = await prisma.badge.delete({ where: { id } });
  await logAction(actorId, 'DELETE', 'BADGE', id);
  return badge;
};

export const getAuditLogs = async (page: number = 1, limit: number = 20) => {
  const { skip, take } = getPagination(page, limit);
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip, take,
      include: { actor: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count(),
  ]);
  return paginatedResponse(logs, total, page, limit);
};
