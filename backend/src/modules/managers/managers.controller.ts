import { Request, Response, NextFunction } from 'express';
import * as managerService from './managers.service';
import { updateManagerSchema, addMemberSchema, updateInventorySchema } from './managers.schema';
import { AuthRequest } from '../../middlewares/authenticate';
import { successResponse, paginationSchema } from '../../utils/helpers';

export const getManagers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { district, name, type } = req.query;
    const result = await managerService.getManagers(page, limit, district as string, name as string, type as string);
    res.json(result);
  } catch (err) { next(err); }
};

export const getManagerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getManagerById(req.params.id as string)));
  } catch (err) { next(err); }
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getMyProfile(req.user!.id)));
  } catch (err) { next(err); }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateManagerSchema.parse(req.body);
    res.json(successResponse(await managerService.updateMyProfile(req.user!.id, input), 'Profile updated'));
  } catch (err) { next(err); }
};

export const getMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    res.json(await managerService.getMembers(req.user!.id, page, limit));
  } catch (err) { next(err); }
};

export const addMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = addMemberSchema.parse(req.body);
    res.status(201).json(await managerService.addMember(req.user!.id, input));
  } catch (err) { next(err); }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await managerService.removeMember(req.user!.id, req.params.memberId as string));
  } catch (err) { next(err); }
};

export const resolveInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token as string;
    res.json(successResponse(await managerService.resolveInviteToken(token)));
  } catch (err) { next(err); }
};
export const getInventory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getInventory(req.user!.id)));
  } catch (err) { next(err); }
};

export const updateInventory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { group, units } = updateInventorySchema.parse(req.body);
    res.json(successResponse(await managerService.updateInventory(req.user!.id, group, units), 'Inventory updated'));
  } catch (err) { next(err); }
};

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getManagerAnalytics(req.user!.id)));
  } catch (err) { next(err); }
};

export const getStrategicRecruits = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getStrategicRecruits(req.user!.id)));
  } catch (err) { next(err); }
};

export const getInventoryLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await managerService.getInventoryLogs(req.user!.id)));
  } catch (err) { next(err); }
};
