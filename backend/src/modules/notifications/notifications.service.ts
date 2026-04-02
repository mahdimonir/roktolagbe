import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { getPagination, paginatedResponse, successResponse } from '../../utils/helpers';
import { sendEmail } from '../../utils/email';
import { BloodRequest } from '@prisma/client';

export const createNotification = async (userId: string, type: string, message: string) => {
  return prisma.notification.create({
    data: { userId, type, message }
  });
};

// Internal: notify matching donors when a blood request is posted
export const sendNotificationsToMatchingDonors = async (request: BloodRequest) => {
  const matchingDonors = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: request.bloodGroup,
      district: { contains: request.district, mode: 'insensitive' },
      ...(request.thana && { thana: { contains: request.thana, mode: 'insensitive' } }),
      isAvailable: true,
    },
    include: { user: { select: { id: true, email: true } } },
    take: 50, // Limit to avoid mass emails
  });

  const notifications = matchingDonors.map((donor) => ({
    userId: donor.user.id,
    type: 'BLOOD_REQUEST',
    message: `Urgent ${request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} blood needed in ${request.district}. Urgency: ${request.urgency}`,
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }

  // Send email to each matching donor
  for (const donor of matchingDonors) {
    await sendEmail({
      to: donor.user.email,
      subject: `🩸 Urgent Blood Request — ${request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} needed in ${request.district}`,
      html: `
        <h2>Blood Needed Urgently! 🩸</h2>
        <p><strong>Blood Group:</strong> ${request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
        <p><strong>Location:</strong> ${request.district}</p>
        <p><strong>Units Needed:</strong> ${request.units}</p>
        <p><strong>Urgency:</strong> ${request.urgency}</p>
        <p>Log in to RoktoLagbe to help: <a href="${process.env.CLIENT_URL}/urgent-requests">View Request</a></p>
      `,
    }).catch(() => {}); // Don't fail if email fails
  }
};

export const getMyNotifications = async (userId: string, page: number, limit: number) => {
  const { skip, take } = getPagination(page, limit);
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip, take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
  ]);
  return paginatedResponse(notifications, total, page, limit);
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const notif = await prisma.notification.findFirst({ where: { id: notificationId, userId } });
  if (!notif) throw new AppError('Notification not found', 404);
  return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return successResponse(null, 'All notifications marked as read');
};
