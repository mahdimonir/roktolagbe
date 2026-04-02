import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { getPagination, paginatedResponse } from '../../utils/helpers';
import { generateDonationCard } from '../../utils/cardGenerator';
import { UpdateDonorInput, LogDonationInput } from './donors.schema';
import { checkAndAwardBadges } from '../badges/badges.service';

// Public — anonymized donor list
export const getDonors = async (page: number, limit: number) => {
  const { skip, take } = getPagination(page, limit);
  const [donors, total] = await Promise.all([
    prisma.donorProfile.findMany({
      skip,
      take,
      where: { isAvailable: true },
      select: {
        id: true,
        bloodGroup: true,
        district: true,
        isAvailable: true,
        lastDonationDate: true,
        totalDonations: true,
        badges: { take: 3, include: { badge: true } },
      },
      orderBy: { lastDonationDate: 'desc' },
    }),
    prisma.donorProfile.count({ where: { isAvailable: true } }),
  ]);
  return paginatedResponse(donors, total, page, limit);
};

// For public view — anonymized but with name and impact
export const getPublicDonorProfile = async (id: string, requester?: { id: string, role: string }) => {
  // If ANY authenticated user requests the profile, they can see contact info
  // This matches the search donors logic where seekers see phone numbers.
  const isPrivileged = !!requester;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DonorProfile] ID: ${id} | Requester: ${requester?.id || 'GUEST'} | Role: ${requester?.role || 'NONE'} | Privileged: ${isPrivileged}`);
  }

  const donor = await prisma.donorProfile.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bloodGroup: true,
      division: true,
      district: true,
      thana: true,
      address: true,
      profileImage: true,
      isAvailable: true,
      lastDonationDate: true,
      totalDonations: true,
      points: true,
      bio: true,
      occupation: true,
      fbUrl: true,
      linkedinUrl: true,
      donations: {
        orderBy: { donatedAt: 'desc' },
        take: 10,
        select: { donatedAt: true, pointsEarned: true },
      },
      badges: {
        include: { badge: true },
      },
      memberOf: {
        include: {
          manager: {
            select: { id: true, name: true, type: true, logoUrl: true },
          },
        },
      },
      // Conditionally include contact info for Managers/Admins or the donor themselves
      ...(isPrivileged && {
        user: {
          select: { email: true, phone: true }
        }
      })
    },
  });
  if (!donor) throw new AppError('Donor profile not found', 404);
  return donor;
};

// For managers/admin — full profile with name
export const getDonorById = async (id: string) => {
  const donor = await prisma.donorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, phone: true } },
    },
  });
  if (!donor) throw new AppError('Donor not found', 404);
  return donor;
};

// Donor's own profile
export const getMyProfile = async (userId: string) => {
  const donor = await prisma.donorProfile.findUnique({
    where: { userId },
    include: {
      donations: {
        orderBy: { donatedAt: 'desc' },
        take: 10,
      },
      badges: {
        include: { badge: true },
        orderBy: { awardedAt: 'desc' }
      },
    },
  });
  if (!donor) throw new AppError('Donor profile not found', 404);
  return donor;
};

import { logAction } from '../audit/audit.service';

// Update own profile
export const updateMyProfile = async (userId: string, input: UpdateDonorInput) => {
  const profile = await prisma.donorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Donor profile not found', 404);

  const updatedProfile = await prisma.donorProfile.update({
    where: { userId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.district && { district: input.district }),
      ...(input.division && { division: input.division }),
      ...(input.address && { address: input.address }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.occupation !== undefined && { occupation: input.occupation }),
      ...(input.fbUrl !== undefined && { fbUrl: input.fbUrl }),
      ...(input.linkedinUrl !== undefined && { linkedinUrl: input.linkedinUrl }),
      ...(input.profileImage !== undefined && { profileImage: input.profileImage }),
      ...(typeof input.isAvailable === 'boolean' && { isAvailable: input.isAvailable }),
    },
  });

  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'DONOR', profile.id, { changes: input });

  // Update phone if provided
  if (input.phone) {
    await prisma.user.update({ where: { id: userId }, data: { phone: input.phone } });
  }

  return updatedProfile;
};

// Log a donation
export const logDonation = async (
  userId: string,
  input: LogDonationInput,
  imagePath?: string
) => {
  const profile = await prisma.donorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Donor profile not found', 404);

  const cardPath = await generateDonationCard(
    profile.name,
    profile.bloodGroup,
    profile.district || 'General',
    new Date(),
    imagePath
  );

  const [donation] = await prisma.$transaction([
    prisma.donationHistory.create({
      data: {
        donorId: profile.id,
        requestId: input.requestId,
        imagePath,
        cardPath,
        notes: input.notes,
      },
    }),
    prisma.donorProfile.update({
      where: { id: profile.id },
      data: {
        totalDonations: { increment: 1 },
        points: { increment: 100 },
        lastDonationDate: new Date(),
        isAvailable: false, // Mark unavailable after donation (can update later)
      },
    }),
    // If linked to a request, update it
    ...(input.requestId
      ? [
          prisma.bloodRequest.update({
            where: { id: input.requestId },
            data: { status: 'FULFILLED' },
          }),
        ]
      : []),
  ]);

  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'DONATION', donation.id, { 
    type: 'MANUAL_ENTRY', 
    requestId: input.requestId 
  });

  // Award badges async
  checkAndAwardBadges(profile.id).catch(console.error);

  return donation;
};

// Donor history
export const getMyDonationHistory = async (userId: string, page: number, limit: number) => {
  const profile = await prisma.donorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Donor profile not found', 404);

  const { skip, take } = getPagination(page, limit);
  const [donations, total] = await Promise.all([
    prisma.donationHistory.findMany({
      where: { donorId: profile.id },
      skip,
      take,
      include: {
        request: { select: { bloodGroup: true, district: true, managerId: true } },
      },
      orderBy: { donatedAt: 'desc' },
    }),
    prisma.donationHistory.count({ where: { donorId: profile.id } }),
  ]);

  return paginatedResponse(donations, total, page, limit);
};
// Public Search — specialized for the discovery portal
export const searchDonors = async (
  bloodGroup: string,
  division: string,
  district: string,
  thana: string,
  page: number,
  limit: number,
  name?: string,
  phone?: string,
  isAuthenticated?: boolean
) => {
  const { skip, take } = getPagination(page, limit);
  const where: any = {
    ...(bloodGroup && { bloodGroup: bloodGroup as any }),
    ...(division && { division: { contains: division, mode: 'insensitive' as const } }),
    ...(district && { district: { contains: district, mode: 'insensitive' as const } }),
    ...(thana && { thana: { contains: thana, mode: 'insensitive' as const } }),
    ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
    ...(phone && { user: { phone: { contains: phone } } }),
    isAvailable: true,
  };

  const [donors, total] = await Promise.all([
    prisma.donorProfile.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        division: true,
        district: true,
        thana: true,
        lastDonationDate: true,
        totalDonations: true,
        isAvailable: true,
        badges: { take: 3, include: { badge: true } },
        // Only include phone for authenticated users
        ...(isAuthenticated && {
          user: { select: { phone: true } }
        }),
      },
      orderBy: { lastDonationDate: 'desc' },
    }),
    prisma.donorProfile.count({ where }),
  ]);

  return paginatedResponse(donors, total, page, limit);
};

export const getDonorAnalytics = async (userId: string) => {
  const donor = await prisma.donorProfile.findUnique({ 
    where: { userId },
    include: {
      badges: { include: { badge: true } },
      memberOf: { include: { manager: true } }
    }
  });

  if (!donor) throw new AppError('Donor profile not found', 404);

  const [recentMissions, nearbyRequests] = await Promise.all([
    prisma.donationHistory.findMany({
      where: { donorId: donor.id },
      take: 5,
      orderBy: { donatedAt: 'desc' },
      include: {
        request: { select: { hospitalName: true, district: true, bloodGroup: true } }
      }
    }),
    prisma.bloodRequest.count({
      where: {
        status: 'OPEN',
        bloodGroup: donor.bloodGroup,
        district: donor.district || undefined
      }
    })
  ]);

  // Logic for rank
  let rank = 'Bronze';
  if (donor.points >= 5000) rank = 'Titanium';
  else if (donor.points >= 2500) rank = 'Platinum';
  else if (donor.points >= 1000) rank = 'Gold';
  else if (donor.points >= 500) rank = 'Silver';

  return {
    stats: {
      totalDonations: donor.totalDonations,
      points: donor.points,
      rank,
      isAvailable: donor.isAvailable,
      nearbyRequests,
      badgesCount: donor.badges.length
    },
    recentMissions: recentMissions.map(m => ({
      id: m.id,
      hospital: m.request?.hospitalName || 'Manual Entry',
      district: m.request?.district || donor.district,
      date: m.donatedAt,
      status: m.status,
      pointsEarned: m.pointsEarned
    }))
  };
};
