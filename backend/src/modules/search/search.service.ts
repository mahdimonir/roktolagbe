import { prisma } from '../../lib/prisma';
import cache from '../../lib/cache';

interface Suggestion {
  text: string;
  type: 'blood_group' | 'district' | 'thana' | 'donor' | 'hospital' | 'condition' | 'compound';
  count: number | null;
}

const BLOOD_GROUP_MAP: Record<string, string> = {
  'a+': 'A_POS', 'a-': 'A_NEG', 'b+': 'B_POS', 'b-': 'B_NEG',
  'ab+': 'AB_POS', 'ab-': 'AB_NEG', 'o+': 'O_POS', 'o-': 'O_NEG',
  'a_pos': 'A_POS', 'a_neg': 'A_NEG', 'b_pos': 'B_POS', 'b_neg': 'B_NEG',
  'ab_pos': 'AB_POS', 'ab_neg': 'AB_NEG', 'o_pos': 'O_POS', 'o_neg': 'O_NEG',
};

const BLOOD_GROUP_DISPLAY: Record<string, string> = {
  'A_POS': 'A+', 'A_NEG': 'A-', 'B_POS': 'B+', 'B_NEG': 'B-',
  'AB_POS': 'AB+', 'AB_NEG': 'AB-', 'O_POS': 'O+', 'O_NEG': 'O-',
};

const ALL_BLOOD_GROUPS = Object.keys(BLOOD_GROUP_DISPLAY);

/**
 * Get search suggestions based on query and context.
 * Results are cached for 5 minutes.
 */
export const getSuggestions = async (
  query: string,
  context: 'donors' | 'requests' | 'organizations'
): Promise<Suggestion[]> => {
  if (!query || query.length < 1) return [];

  const q = query.trim().toLowerCase();
  const cacheKey = `suggestions:${context}:${q}`;

  // Check cache first
  const cached = cache.get<Suggestion[]>(cacheKey);
  if (cached) return cached;

  const suggestions: Suggestion[] = [];

  // 1. Check blood group matches
  const matchingBloodGroups = ALL_BLOOD_GROUPS.filter(bg => {
    const display = BLOOD_GROUP_DISPLAY[bg].toLowerCase();
    const enumVal = bg.toLowerCase();
    return display.startsWith(q) || display.includes(q) || enumVal.includes(q);
  });

  // Also check if user typed shorthand like "a+", "b-"
  const normalizedGroup = BLOOD_GROUP_MAP[q];
  if (normalizedGroup && !matchingBloodGroups.includes(normalizedGroup)) {
    matchingBloodGroups.push(normalizedGroup);
  }

  if (context === 'donors') {
    // Blood group suggestions with donor count
    for (const bg of matchingBloodGroups.slice(0, 3)) {
      const count = await prisma.donorProfile.count({
        where: { bloodGroup: bg as any, isAvailable: true }
      });
      suggestions.push({
        text: BLOOD_GROUP_DISPLAY[bg],
        type: 'blood_group',
        count
      });
    }

    // District suggestions
    const districts = await prisma.donorProfile.groupBy({
      by: ['district'],
      where: {
        district: { contains: q, mode: 'insensitive' },
        isAvailable: true,
      },
      _count: true,
      orderBy: { _count: { district: 'desc' } },
      take: 4,
    });

    for (const d of districts) {
      if (d.district) {
        suggestions.push({
          text: d.district,
          type: 'district',
          count: d._count,
        });
      }
    }

    // Thana suggestions
    const thanas = await prisma.donorProfile.groupBy({
      by: ['thana'],
      where: {
        thana: { contains: q, mode: 'insensitive' },
        isAvailable: true,
      },
      _count: true,
      orderBy: { _count: { thana: 'desc' } },
      take: 3,
    });

    for (const t of thanas) {
      if (t.thana) {
        suggestions.push({
          text: t.thana,
          type: 'thana',
          count: t._count,
        });
      }
    }

    // Donor name suggestions (if query length >= 2)
    if (q.length >= 2) {
      const donors = await prisma.donorProfile.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          isAvailable: true,
        },
        select: { name: true },
        take: 3,
      });

      for (const d of donors) {
        suggestions.push({
          text: d.name,
          type: 'donor',
          count: null,
        });
      }
    }

    // Compound suggestions: "B+ in Dhaka"
    if (matchingBloodGroups.length > 0 && districts.length > 0) {
      const bg = BLOOD_GROUP_DISPLAY[matchingBloodGroups[0]];
      const dist = districts[0].district;
      if (dist) {
        const compoundCount = await prisma.donorProfile.count({
          where: {
            bloodGroup: matchingBloodGroups[0] as any,
            district: dist,
            isAvailable: true,
          }
        });
        suggestions.push({
          text: `${bg} in ${dist}`,
          type: 'compound',
          count: compoundCount,
        });
      }
    }

  } else if (context === 'requests') {
    // Blood group suggestions with request count
    for (const bg of matchingBloodGroups.slice(0, 3)) {
      const count = await prisma.bloodRequest.count({
        where: { bloodGroup: bg as any, status: 'OPEN' }
      });
      suggestions.push({
        text: BLOOD_GROUP_DISPLAY[bg],
        type: 'blood_group',
        count
      });
    }

    // District suggestions from requests
    const districts = await prisma.bloodRequest.groupBy({
      by: ['district'],
      where: {
        district: { contains: q, mode: 'insensitive' },
        status: 'OPEN',
      },
      _count: true,
      orderBy: { _count: { district: 'desc' } },
      take: 4,
    });

    for (const d of districts) {
      suggestions.push({
        text: d.district,
        type: 'district',
        count: d._count,
      });
    }

    // Hospital name suggestions
    if (q.length >= 2) {
      const hospitals = await prisma.bloodRequest.groupBy({
        by: ['hospitalName'],
        where: {
          hospitalName: { contains: q, mode: 'insensitive' },
          status: 'OPEN',
        },
        _count: true,
        orderBy: { _count: { hospitalName: 'desc' } },
        take: 3,
      });

      for (const h of hospitals) {
        suggestions.push({
          text: h.hospitalName,
          type: 'hospital',
          count: h._count,
        });
      }
    }

    // Patient condition suggestions
    if (q.length >= 2) {
      const conditions = await prisma.bloodRequest.groupBy({
        by: ['patientCondition'],
        where: {
          patientCondition: { contains: q, mode: 'insensitive' },
          status: 'OPEN',
        },
        _count: true,
        orderBy: { _count: { patientCondition: 'desc' } },
        take: 2,
      });

      for (const c of conditions) {
        if (c.patientCondition) {
          suggestions.push({
            text: c.patientCondition,
            type: 'condition',
            count: c._count,
          });
        }
      }
    }

  } else if (context === 'organizations') {
    // Organization name suggestions
    const orgs = await prisma.managerProfile.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { district: { contains: q, mode: 'insensitive' } },
        ],
        isVerified: true,
      },
      select: { name: true, district: true, type: true },
      take: 5,
    });

    for (const org of orgs) {
      // Check if it's a name match or district match
      if (org.name.toLowerCase().includes(q)) {
        suggestions.push({
          text: org.name,
          type: 'hospital',
          count: null,
        });
      }
    }

    // District suggestions from organizations
    const districts = await prisma.managerProfile.groupBy({
      by: ['district'],
      where: {
        district: { contains: q, mode: 'insensitive' },
        isVerified: true,
      },
      _count: true,
      orderBy: { _count: { district: 'desc' } },
      take: 4,
    });

    for (const d of districts) {
      suggestions.push({
        text: d.district,
        type: 'district',
        count: d._count,
      });
    }
  }

  // Deduplicate by text (case-insensitive)
  const seen = new Set<string>();
  const deduped = suggestions.filter(s => {
    const key = s.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: blood_group first, then by count (descending), then compound
  const result = deduped
    .sort((a, b) => {
      const typeOrder: Record<string, number> = {
        blood_group: 0, district: 1, thana: 2, hospital: 3, donor: 4, condition: 5, compound: 6
      };
      const orderDiff = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
      if (orderDiff !== 0) return orderDiff;
      return (b.count ?? 0) - (a.count ?? 0);
    })
    .slice(0, 10);

  // Cache for 5 minutes
  cache.set(cacheKey, result, 300);

  return result;
};
