import { z } from 'zod';

export const createRequestSchema = z.object({
  bloodGroup: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']),
  units: z.number().int().min(1),
  division: z.string().optional(),
  district: z.string().min(1),
  thana: z.string().optional(),
  urgency: z.enum(['CRITICAL', 'EMERGENCY', 'NORMAL']).default('NORMAL'),
  deadline: z.string().transform((d) => new Date(d)),
  notes: z.string().optional(),
  patientCondition: z.string().optional(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  relationship: z.string().optional(),
  hemoglobin: z.string().optional(),
  hospitalName: z.string().min(1, 'Hospital name is required'),
  detailedAddress: z.string().optional(),
  contactPhone: z.string().optional(),
  isEmergency: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
});

export const emergencyRequestSchema = z.object({
  bloodGroup: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']),
  units: z.number().int().min(1),
  division: z.string().optional(),
  district: z.string().min(1),
  thana: z.string().optional(),
  patientCondition: z.string().optional(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  relationship: z.string().optional(),
  hemoglobin: z.string().optional(),
  hospitalName: z.string().min(1, 'Hospital name is required'),
  detailedAddress: z.string().optional(),
  contactPhone: z.string().min(10, 'Contact phone is required for emergency requests'),
  deadline: z.string().optional().transform((d) => d ? new Date(d) : new Date(Date.now() + 24 * 60 * 60 * 1000)),
  isEmergency: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
  notes: z.string().optional(),
});

export const updateRequestSchema = z.object({
  status: z.enum(['OPEN', 'FULFILLED', 'EXPIRED', 'CANCELLED']).optional(),
  urgency: z.enum(['CRITICAL', 'EMERGENCY', 'NORMAL']).optional(),
  notes: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type EmergencyRequestInput = z.infer<typeof emergencyRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
