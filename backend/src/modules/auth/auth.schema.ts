import { z } from 'zod';
import { managerTypes } from '../../utils/helpers';

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['DONOR', 'MANAGER']),
  // Donor fields
  name: z.string().min(1).optional(),
  bloodGroup: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  // Manager fields
  managerName: z.string().optional(),
  managerType: z.enum(managerTypes).optional(),
  managerDivision: z.string().optional(),
  managerDistrict: z.string().optional(),
  contactPhone: z.string().optional(),
  orgRef: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'DONOR') {
    if (!data.name) ctx.addIssue({ code: 'custom', message: 'Name is required for donors', path: ['name'] });
    if (!data.bloodGroup) ctx.addIssue({ code: 'custom', message: 'Blood group is required', path: ['bloodGroup'] });
    if (!data.district) ctx.addIssue({ code: 'custom', message: 'District is required', path: ['district'] });
  }
  if (data.role === 'MANAGER') {
    if (!data.managerName) ctx.addIssue({ code: 'custom', message: 'Organization/Hospital name is required', path: ['managerName'] });
    if (!data.managerType) ctx.addIssue({ code: 'custom', message: 'Type (hospital or organization) is required', path: ['managerType'] });
    if (!data.managerDistrict) ctx.addIssue({ code: 'custom', message: 'District is required', path: ['managerDistrict'] });
    if (!data.contactPhone) ctx.addIssue({ code: 'custom', message: 'Contact phone is required', path: ['contactPhone'] });
  }
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
