import { Request, Response, NextFunction } from 'express';
import * as donorService from './donors.service';
import { updateDonorSchema, logDonationSchema } from './donors.schema';
import { AuthRequest } from '../../middlewares/authenticate';
import { successResponse, paginationSchema } from '../../utils/helpers';

export const getDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await donorService.getDonors(page, limit);
    res.json(result);
  } catch (err) { next(err); }
};

export const getDonorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donor = await donorService.getDonorById(req.params.id as string);
    res.json(successResponse(donor));
  } catch (err) { next(err); }
};

export const getPublicDonorProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const donor = await donorService.getPublicDonorProfile(req.params.id as string, req.user);
    res.json(successResponse(donor));
  } catch (err) { next(err); }
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const donor = await donorService.getMyProfile(req.user!.id);
    res.json(successResponse(donor));
  } catch (err) { next(err); }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateDonorSchema.parse(req.body);
    const donor = await donorService.updateMyProfile(req.user!.id, input);
    res.json(successResponse(donor, 'Profile updated'));
  } catch (err) { next(err); }
};

export const logDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = logDonationSchema.parse(req.body);
    const imagePath = input.imagePath;
    const donation = await donorService.logDonation(req.user!.id, input, imagePath);
    res.status(201).json(successResponse(donation, 'Donation logged successfully'));
  } catch (err) { next(err); }
};

export const getMyHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await donorService.getMyDonationHistory(req.user!.id, page, limit);
    res.json(result);
  } catch (err) { next(err); }
};
export const searchDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { bloodGroup, division, district, thana, name, phone } = req.query;
    // Check if requester is authenticated (has a valid JWT in header)
    const isAuthenticated = !!(req as any).user;
    const result = await donorService.searchDonors(
      bloodGroup as string,
      division as string,
      district as string,
      thana as string,
      page,
      limit,
      name as string,
      phone as string,
      isAuthenticated
    );
    res.json(result);
  } catch (err) { next(err); }
};

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await donorService.getDonorAnalytics(req.user!.id)));
  } catch (err) { next(err); }
};
