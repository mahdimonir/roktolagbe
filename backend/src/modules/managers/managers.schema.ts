import { z } from 'zod';

export const updateManagerSchema = z.object({
  name: z.string().optional(),
  district: z.string().optional(),
  contactPhone: z.string().optional(),
  logoUrl: z.string().url().optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
});

export const addMemberSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
});

export const updateInventorySchema = z.object({
  group: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']),
  units: z.number().min(0),
});

export type UpdateManagerInput = z.infer<typeof updateManagerSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
