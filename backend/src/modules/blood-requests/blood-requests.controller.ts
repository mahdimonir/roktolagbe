import { Request, Response, NextFunction } from 'express';
import * as bloodRequestService from './blood-requests.service';
import { createRequestSchema, updateRequestSchema } from './blood-requests.schema';
import { AuthRequest } from '../../middlewares/authenticate';
import { successResponse, paginationSchema } from '../../utils/helpers';

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const district = typeof req.query.district === 'string' ? req.query.district : undefined;
    const thana = typeof req.query.thana === 'string' ? req.query.thana : undefined;
    const bloodGroup = typeof req.query.bloodGroup === 'string' ? req.query.bloodGroup : undefined;
    res.json(await bloodRequestService.getRequests(page, limit, district, bloodGroup, thana));
  } catch (err) { next(err); }
};

export const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await bloodRequestService.getRequestById(req.params.id as string)));
  } catch (err) { next(err); }
};

export const getShortlistedDonors = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await bloodRequestService.getShortlistedDonors(req.params.id as string, req.user!)));
  } catch (err) { next(err); }
};

export const createRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createRequestSchema.parse(req.body);
    res.status(201).json(successResponse(await bloodRequestService.createRequest(req.user!.id, input), 'Blood request created'));
  } catch (err) { next(err); }
};

export const createEmergencyRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emergencyRequestSchema } = await import('./blood-requests.schema');
    const input = emergencyRequestSchema.parse(req.body);
    res.status(201).json(successResponse(await bloodRequestService.createEmergencyRequest(input), 'Emergency blood request posted'));
  } catch (err) { next(err); }
};

export const updateRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateRequestSchema.parse(req.body);
    const isAdmin = req.user!.role === 'ADMIN';
    res.json(successResponse(await bloodRequestService.updateRequest(req.user!.id, req.params.id as string, input, isAdmin)));
  } catch (err) { next(err); }
};

export const deleteRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'ADMIN';
    await bloodRequestService.deleteRequest(req.user!.id, req.params.id as string, isAdmin);
    res.json(successResponse(null, 'Request cancelled'));
  } catch (err) { next(err); }
};

export const commitToRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await bloodRequestService.commitToRequest(req.user!.id, req.params.id as string), 'You have committed to this mission 🩸'));
  } catch (err) { next(err); }
};

export const verifyDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await bloodRequestService.verifyDonation(req.user!.id, req.params.donationId as string);
    res.json(successResponse(result, 'Donation successfully verified! Points allocated. ✨'));
  } catch (err) { next(err); }
};
