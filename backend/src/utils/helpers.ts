import { z } from 'zod';

export const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'] as const;
export const roles = ['DONOR', 'MANAGER', 'ADMIN'] as const;
export const urgencyLevels = ['CRITICAL', 'HIGH', 'NORMAL'] as const;
export const requestStatuses = ['OPEN', 'FULFILLED', 'EXPIRED', 'CANCELLED'] as const;
export const managerTypes = ['hospital', 'organization'] as const;

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export const getPagination = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const successResponse = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => ({
  success: true,
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});
