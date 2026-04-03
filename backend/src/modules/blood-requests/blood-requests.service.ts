import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { getPagination, paginatedResponse } from '../../utils/helpers';
import { CreateRequestInput, UpdateRequestInput, EmergencyRequestInput } from './blood-requests.schema';
import { sendNotificationsToMatchingDonors, createNotification } from '../notifications/notifications.service';

export const getRequests = async (page: number, limit: number, district?: string, bloodGroup?: string, thana?: string) => {
  const { skip, take } = getPagination(page, limit);
  const where = { 
    status: 'OPEN' as const, 
    ...(district && { district: { contains: district, mode: 'insensitive' as const } }),
    ...(thana && { thana: { contains: thana, mode: 'insensitive' as const } }),
    ...(bloodGroup && { bloodGroup: bloodGroup as any })
  };
  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      skip,
      take,
      where,
      include: { 
        manager: { select: { name: true, type: true, district: true } },
        donations: { select: { status: true } }
      },
      orderBy: [
        { isEmergency: 'desc' }, // Emergency first
        { urgency: 'asc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.bloodRequest.count({ where }),
  ]);
  return paginatedResponse(requests, total, page, limit);
};

export const getRequestById = async (id: string) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id },
    include: {
      manager: { select: { userId: true, name: true, type: true, district: true, contactPhone: true } },
      donations: { select: { donor: { select: { userId: true } } } },
      _count: { select: { donations: true } },
    },
  });
  if (!request) throw new AppError('Blood request not found', 404);
  return request;
};

export const getShortlistedDonors = async (requestId: string, requester: { id: string, role: string }) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
    include: { manager: true }
  });
  if (!request) throw new AppError('Blood request not found', 404);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Shortlist Match] IG: ${request.id} | Group: ${request.bloodGroup} | District: ${request.district} | Thana: ${request.thana || 'NONE'}`);
  }

  // Authorization check: Seeker (if managerId exists and matches), Admin, or any Manager for anonymous emergency requests
  const isCreator = request.manager?.userId === requester.id;
  const isPrivilegedRole = requester.role === 'ADMIN' || requester.role === 'MANAGER';
  
  if (!isCreator && !isPrivilegedRole) {
    throw new AppError('Unauthorized to view shortlisted donors info', 403);
  }

  // Matching Logic - Case-Insensitive District/Thana OR Matching
  const matchingDonors = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: request.bloodGroup,
      isAvailable: true,
      OR: [
        { district: { contains: request.district, mode: 'insensitive' } },
        { thana: { contains: request.district, mode: 'insensitive' } },
        { district: { contains: request.thana || '', mode: 'insensitive' } },
        { thana: { contains: request.thana || '', mode: 'insensitive' } }
      ],
      // Optional: don't show donors who already donated to this request
      donations: {
        none: { requestId: request.id }
      }
    },
    select: {
      id: true,
      name: true,
      thana: true,
      district: true,
      totalDonations: true,
      lastDonationDate: true,
      user: {
        select: {
          phone: true,
          email: true
        }
      }
    },
    take: 20,
    orderBy: [
      { lastDonationDate: 'asc' } // Oldest donation first = more ready to donate
    ]
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Shortlist Match] Results Found: ${matchingDonors.length}`);
  }

  // Priority sort by thana match if present (Case-Insensitive)
  if (request.thana) {
    const targetThana = request.thana.toLowerCase();
    return matchingDonors.sort((a, b) => {
      const aThana = a.thana?.toLowerCase() || '';
      const bThana = b.thana?.toLowerCase() || '';
      if (aThana === targetThana && bThana !== targetThana) return -1;
      if (aThana !== targetThana && bThana === targetThana) return 1;
      return 0;
    });
  }

  return matchingDonors;
};

export const commitToRequest = async (userId: string, requestId: string) => {
  const donor = await prisma.donorProfile.findUnique({ where: { userId } });
  if (!donor) throw new AppError('Only registered donors can commit to requests', 403);

  const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new AppError('Blood request not found', 404);
  if (request.status !== 'OPEN') throw new AppError('This request is no longer open', 400);

  // Prevent duplicate commitments
  const existingCommitment = await prisma.donationHistory.findFirst({
    where: { donorId: donor.id, requestId }
  });
  if (existingCommitment) throw new AppError('You have already committed to this request', 400);

  // Create pending donation record
  const commitment = await prisma.donationHistory.create({
    data: {
      donorId: donor.id,
      requestId,
      status: 'COMMITTED',
      notes: 'Donor committed via platform',
      pointsEarned: 10, // Reward for commitment
    },
    include: { donor: true, request: { include: { manager: true } } }
  });

  // Notify Manager
  if (commitment.request?.manager?.userId) {
    await createNotification(
      commitment.request.manager.userId,
      'DONOR_COMMIT',
      `Hero ${donor.name} has committed to your request at ${commitment.request.hospitalName}.`
    );
  }

  return commitment;
};

import { logAction } from '../audit/audit.service';

export const createRequest = async (userId: string, input: CreateRequestInput) => {
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager) throw new AppError('Manager profile not found', 404);
  if (!manager.isVerified) throw new AppError('Your account must be verified to post requests', 403);

  const request = await prisma.bloodRequest.create({
    data: { ...input, managerId: manager.id },
  });

  // Audit Log
  await logAction(userId, 'REQUEST_CREATE', 'REQUEST', request.id, { 
    hospital: request.hospitalName, 
    group: request.bloodGroup 
  });

  // Notify matching donors async
  sendNotificationsToMatchingDonors(request).catch(console.error);

  return request;
};

export const createEmergencyRequest = async (input: EmergencyRequestInput) => {
  const request = await prisma.bloodRequest.create({
    data: {
      ...input,
      urgency: 'EMERGENCY',
    },
  });

  // Audit Log (Using 'SYSTEM' for anonymous emergency requests if no specific user is provided, 
  // but usually anonymous requests come from a Guest or the system itself)
  // For now, if no ID is passed, we'll need a generic reference or rely on the caller
  
  // Notify matching donors async
  sendNotificationsToMatchingDonors(request).catch(console.error);

  return request;
};

export const updateRequest = async (userId: string, requestId: string, input: UpdateRequestInput, isAdmin = false) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id: requestId }, include: { manager: true } });
  if (!request) throw new AppError('Blood request not found', 404);

  if (!isAdmin && request.manager?.userId !== userId) {
    throw new AppError('You can only update your own requests', 403);
  }

  const updated = await prisma.bloodRequest.update({ where: { id: requestId }, data: input });
  
  // Audit Log
  await logAction(userId, 'PROFILE_UPDATE', 'REQUEST', requestId, { changes: input });
  
  return updated;
};

export const deleteRequest = async (userId: string, requestId: string, isAdmin = false) => {
  const request = await prisma.bloodRequest.findUnique({ where: { id: requestId }, include: { manager: true } });
  if (!request) throw new AppError('Blood request not found', 404);
  if (!isAdmin && request.manager?.userId !== userId) {
    throw new AppError('You can only delete your own requests', 403);
  }
  await prisma.bloodRequest.update({ where: { id: requestId }, data: { status: 'CANCELLED' } });
  
  // Audit Log
  await logAction(userId, 'REQUEST_DELETE', 'REQUEST', requestId);
};

export const verifyDonation = async (userId: string, donationId: string) => {
  const donation = await prisma.donationHistory.findUnique({
    where: { id: donationId },
    include: { request: true, donor: true }
  });

  if (!donation) throw new AppError('Donation record not found', 404);
  if (!donation.request) throw new AppError('No associated blood request found', 400);

  // Check if the requester is the manager of this request
  const manager = await prisma.managerProfile.findUnique({ where: { userId } });
  if (!manager || donation.request.managerId !== manager.id) {
    throw new AppError('Unauthorized: Only the host manager can verify donations', 403);
  }

  if (donation.status === 'VERIFIED') throw new AppError('Donation already verified', 400);

  // Use a transaction to ensure atomic update
  return prisma.$transaction(async (tx) => {
    // 1. Update donation status
    const updatedDonation = await tx.donationHistory.update({
      where: { id: donationId },
      data: { 
        status: 'VERIFIED',
        pointsEarned: { increment: 50 }, // Bonus points for actual fulfillment
        donatedAt: new Date()
      }
    });

    // 2. Update donor profile stats
    await tx.donorProfile.update({
      where: { id: donation.donorId },
      data: {
        totalDonations: { increment: 1 },
        points: { increment: 50 },
        lastDonationDate: new Date(),
        isAvailable: false // Set to recovery mode
      }
    });

    // Audit Log
    await logAction(userId, 'DONATION_VERIFY', 'DONATION', donationId, { 
      donorId: donation.donorId, 
      requestId: donation.requestId 
    });

    // Notify Donor
    await createNotification(
      donation.donor.userId,
      'DONATION_VERIFIED',
      `Your life-saving mission at ${donation.request?.hospitalName} has been verified! 50 Honor Points added.`
    );

    // 3. Check if request is now fully fulfilled
    const verifiedCount = await tx.donationHistory.count({
      where: { requestId: donation.requestId, status: 'VERIFIED' }
    });

    if (verifiedCount >= donation.request!.units) {
      await tx.bloodRequest.update({
        where: { id: donation.requestId! },
        data: { status: 'FULFILLED' }
      });
    }

    return updatedDonation;
  });
};
