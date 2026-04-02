import { z } from 'zod';

export const updateDonorSchema = z.object({
  name: z.string().optional(),
  district: z.string().optional(),
  isAvailable: z.boolean().optional(),
  division: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(300).optional(),
  occupation: z.string().optional(),
  fbUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  profileImage: z.string().url().optional().or(z.literal('')),
});

export const logDonationSchema = z.object({
  requestId: z.string().optional(),
  notes: z.string().optional(),
  imagePath: z.string().optional(),
});

export type UpdateDonorInput = z.infer<typeof updateDonorSchema>;
export type LogDonationInput = z.infer<typeof logDonationSchema>;
