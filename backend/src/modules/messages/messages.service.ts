import { prisma } from '../../lib/prisma';
import { successResponse } from '../../utils/helpers';

export const getMessages = async (userId: string, contactId: string) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });
};

import { logAction } from '../audit/audit.service';

export const sendMessage = async (senderId: string, receiverId: string, content: string, isEmergency: boolean = false) => {
  const message = await prisma.message.create({
    data: { 
      senderId, 
      receiverId, 
      content,
      isEmergency 
    },
  });

  if (isEmergency) {
    await logAction(senderId, 'MESSAGE_SEND', 'MESSAGE', message.id, { isEmergency: true });
  }

  return message;
};

export const getConversations = async (userId: string) => {
  const sent = await prisma.message.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
    distinct: ['receiverId'],
  });
  const received = await prisma.message.findMany({
    where: { receiverId: userId },
    select: { senderId: true },
    distinct: ['senderId'],
  });

  const contactIds = Array.from(new Set([
    ...sent.map((m: any) => m.receiverId),
    ...received.map((m: any) => m.senderId),
  ]));

  return prisma.user.findMany({
    where: { id: { in: contactIds } },
    select: { id: true, email: true, phone: true, role: true },
  });
};
