import { prisma } from '../../lib/prisma';

export const getAvailableBadges = async () => {
  return prisma.badge.findMany({
    orderBy: { createdAt: 'asc' },
  });
};

export const getDonorBadges = async (donorId: string) => {
  return prisma.donorBadge.findMany({
    where: { donorId },
    include: { badge: true },
    orderBy: { awardedAt: 'desc' },
  });
};

export const checkAndAwardBadges = async (donorId: string) => {
  const donor = await prisma.donorProfile.findUnique({
    where: { id: donorId },
    include: {
      donations: true,
      badges: { include: { badge: true } },
    },
  });

  if (!donor) return;

  const earnedBadgeNames = donor.badges.map((b) => b.badge.name);
  const totalDonations = donor.totalDonations;
  const totalPoints = donor.points;

  const potentialBadges = [
    {
      name: 'First Blood',
      description: 'Logged your first ever donation!',
      icon: 'Droplet',
      category: 'Milestone',
      condition: totalDonations >= 1,
    },
    {
      name: 'Life Saver',
      description: 'Verified 5 successful donations.',
      icon: 'Heart',
      category: 'Milestone',
      condition: totalDonations >= 5,
    },
    {
      name: 'Centurion',
      description: 'A legendary donor with 10+ donations.',
      icon: 'Award',
      category: 'Milestone',
      condition: totalDonations >= 10,
    },
    {
      name: 'Elite Contributor',
      description: 'Earned 1000+ hero points.',
      icon: 'Star',
      category: 'Special',
      condition: totalPoints >= 1000,
    },
  ];

  for (const badgeInfo of potentialBadges) {
    if (badgeInfo.condition && !earnedBadgeNames.includes(badgeInfo.name)) {
      // Award it
      let badge = await prisma.badge.findFirst({ where: { name: badgeInfo.name } });
      if (!badge) {
        badge = await prisma.badge.create({
          data: {
            name: badgeInfo.name,
            description: badgeInfo.description,
            icon: badgeInfo.icon,
            category: badgeInfo.category,
          },
        });
      }

      await prisma.donorBadge.create({
        data: {
          donorId: donor.id,
          badgeId: badge.id,
        },
      });
    }
  }
};
