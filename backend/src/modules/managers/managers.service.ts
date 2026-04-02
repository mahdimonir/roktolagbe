import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { getPagination, paginatedResponse, successResponse } from '../../utils/helpers';
import { UpdateManagerInput, AddMemberInput } from './managers.schema';
import { logAction } from '../audit/audit.service';
import { BloodGroup } from '@prisma/client';

export const getManagers = async (page: number, limit: number, district?: string, name?: string, type?: string) => {
  const { skip, take } = getPagination(page, limit);
  const where = {
    isVerified: true,
    ...(district && { district: { contains: district, mode: 'insensitive' as const } }),
    ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
    ...(type && { type: type as any })
  };
  
  const [managers, total] = await Promise.all([
    prisma.managerProfile.findMany({
      skip,
      take,
      where,
      select: { 
        id: true, name: true, type: true, district: true, 
        contactPhone: true, logoUrl: true, 
        _count: { select: { members: true, bloodRequests: true } }
      },
      orderBy: { name: 'asc' },
    }),
    prisma.managerProfile.count({ where }),
  ]);
  return paginatedResponse(managers, total, page, limit);
};

export const getManagerById = async (id: string) => {
  const manager = await prisma.managerProfile.findUnique({
    where: { id },
    include: {
      _count: { select: { members: true, bloodRequests: true } },
      bloodRequests: {
        where: { status: 'OPEN' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      rewards: {
        where: { isActive: true },
        take: 3,
      },
    },
  });
  if (!manager) throw new AppError('Manager not found', 404);
  return manager;
};

export const getMyProfile = async (userId: string) => {
  const manager = await prisma.managerProfile.findUnique({
    where: { userId },
    include: {
      _count: { select: { members: true, bloodRequests: true } },
      rewards: true,
    },
  });
  if (!manager) throw new AppError('Manager profile not found', 404);
  return manager;
};

export const updateMyProfile = async (userId: string, input: UpdateManagerInput) => {
  const existing = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!existing) throw new AppError('Manager profile not found', 404);
  
  const updated = await prisma.managerProfile.update({
    where: { userId },
    data: input,
  });

  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'MANAGER', existing.id, { changes: input });

  return updated;
};

export const getMembers = async (userId: string, page: number, limit: number) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  const { skip, take } = getPagination(page, limit);
  const [members, total] = await Promise.all([
    prisma.orgMember.findMany({
      where: { managerId: manager.id },
      skip,
      take,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            bloodGroup: true,
            district: true,
            totalDonations: true,
            lastDonationDate: true,
            isAvailable: true,
            points: true,
            badges: { select: { badge: true } },
            user: { select: { phone: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    }),
    prisma.orgMember.count({ where: { managerId: manager.id } }),
  ]);
  return paginatedResponse(members, total, page, limit);
};

export const addMember = async (userId: string, input: AddMemberInput) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  // Find donor by phone
  const donorUser = await prisma.user.findFirst({
    where: { phone: input.phone, role: 'DONOR' },
    include: { donorProfile: true },
  });
  if (!donorUser || !donorUser.donorProfile) {
    throw new AppError('No donor found with this phone number', 404);
  }

  const existing = await prisma.orgMember.findUnique({
    where: { managerId_donorId: { managerId: manager.id, donorId: donorUser.donorProfile.id } },
  });
  if (existing) throw new AppError('Donor is already a member', 409);

  const member = await prisma.orgMember.create({
    data: { managerId: manager.id, donorId: donorUser.donorProfile.id },
    include: { donor: { select: { name: true, bloodGroup: true } } },
  });

  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'MANAGER', manager.id, { 
    action: 'ADD_MEMBER', 
    donorId: donorUser.donorProfile.id 
  });

  return successResponse(member, 'Member added successfully');
};

export const removeMember = async (userId: string, memberId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  const member = await prisma.orgMember.findFirst({
    where: { id: memberId, managerId: manager.id },
  });
  if (!member) throw new AppError('Member not found', 404);

  await prisma.orgMember.delete({ where: { id: memberId } });

  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'MANAGER', manager.id, { 
    action: 'REMOVE_MEMBER', 
    memberId 
  });

  return successResponse(null, 'Member removed');
};

export const resolveInviteToken = async (token: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { inviteToken: token } });
  if (!manager) throw new AppError('Invalid invite link', 404);
  return { managerId: manager.id, managerName: manager.name, type: manager.type };
};
export const getInventory = async (userId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);
  return prisma.bloodInventory.findMany({
    where: { managerId: manager.id },
    orderBy: { group: 'asc' },
  });
};

export const updateInventory = async (userId: string, group: BloodGroup, units: number) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  const inventory = await prisma.bloodInventory.upsert({
    where: { managerId_group: { managerId: manager.id, group } },
    update: { units, updatedAt: new Date() },
    create: { managerId: manager.id, group, units },
  });

  // Audit Log
  await logAction(userId, 'INVENTORY_SYNC', 'INVENTORY', inventory.id, { group, units });

  return inventory;
};

export const getManagerAnalytics = async (userId: string) => {
  const manager = await prisma.managerProfile.findUnique({ 
    where: { userId },
    include: {
      _count: {
        select: {
          members: true,
          bloodRequests: true,
        }
      }
    }
  });

  if (!manager) throw new AppError('Manager profile not found', 404);

  const [requests, inventory, recentDonations] = await Promise.all([
    prisma.bloodRequest.findMany({
      where: { managerId: manager.id },
      select: { status: true, units: true }
    }),
    prisma.bloodInventory.findMany({
      where: { managerId: manager.id }
    }),
    prisma.donationHistory.findMany({
      where: { request: { managerId: manager.id } },
      take: 5,
      orderBy: { donatedAt: 'desc' },
      include: {
        donor: { select: { name: true, profileImage: true, bloodGroup: true } },
        request: { select: { bloodGroup: true, units: true } }
      }
    })
  ]);

  const openRequests = requests.filter(r => r.status === 'OPEN').length;
  const fulfilledRequests = requests.filter(r => r.status === 'FULFILLED').length;
  
  const totalInventoryUnits = inventory.reduce((acc, item) => acc + item.units, 0);
  const criticalInventory = inventory.filter(item => item.units <= 2).length;

  return {
    stats: {
      totalRequests: requests.length,
      openRequests,
      fulfilledRequests,
      totalMembers: manager._count.members,
      inventory: {
        totalUnits: totalInventoryUnits,
        criticalGroups: criticalInventory
      },
      efficiency: requests.length > 0 ? (fulfilledRequests / requests.length) * 100 : 0
    },
    recentActivities: recentDonations.map(d => ({
      id: d.id,
      donorName: d.donor?.name || 'Unknown Donor',
      donorAvatar: d.donor?.profileImage,
      bloodGroup: d.request?.bloodGroup,
      units: d.request?.units,
      status: d.status,
      timestamp: d.donatedAt
    }))
  };
};

export const getStrategicRecruits = async (userId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  // Find donors in the same district who are NOT members of this manager's hub
  const recruits = await prisma.donorProfile.findMany({
    where: {
      district: { contains: manager.district, mode: 'insensitive' },
      memberOf: {
        none: { managerId: manager.id }
      },
      isAvailable: true
    },
    select: {
      id: true,
      name: true,
      bloodGroup: true,
      district: true,
      totalDonations: true,
      points: true,
      profileImage: true,
      user: { select: { phone: true } }
    },
    take: 6,
    orderBy: { totalDonations: 'desc' }
  });

  return recruits;
};

export const getInventoryLogs = async (userId: string) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);

  return prisma.auditLog.findMany({
    where: {
      entity: 'INVENTORY',
      actorId: userId
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
};
