import { prisma } from '../../lib/prisma';
import { getPagination, paginatedResponse } from '../../utils/helpers';

export const getSavedLives = async (page: number, limit: number) => {
  const { skip, take } = getPagination(page, limit);
  
  const [stories, total] = await Promise.all([
    prisma.donationHistory.findMany({
      skip,
      take,
      where: {
        OR: [
          { imagePath: { not: null } },
          { cardPath: { not: null } },
        ],
      },
      include: {
        donor: {
          select: {
            name: true,
            bloodGroup: true,
            district: true,
          },
        },
        request: {
          select: {
            bloodGroup: true,
            district: true,
            isEmergency: true,
          },
        },
      },
      orderBy: { donatedAt: 'desc' },
    }),
    prisma.donationHistory.count({
      where: {
        OR: [
          { imagePath: { not: null } },
          { cardPath: { not: null } },
        ],
      },
    }),
  ]);

  return paginatedResponse(stories, total, page, limit);
};
