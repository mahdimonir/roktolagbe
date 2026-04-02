import { NextFunction, Request, Response } from 'express';
import { paginationSchema, successResponse } from '../../utils/helpers';
import * as adminService from './admin.service';
import { jsonToCsv } from '../../utils/ExportService';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { role } = req.query as { role?: string };
    res.json(await adminService.getAllUsers(page, limit, role));
  } catch (err) { next(err); }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.createUser(actorId, req.body), 'User created successfully'));
  } catch (err) { next(err); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    res.json(successResponse(await adminService.updateUser(actorId, id, req.body), 'User updated successfully'));
  } catch (err) { next(err); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    await adminService.deleteUser(actorId, id);
    res.json(successResponse(null, 'User deactivated'));
  } catch (err) { next(err); }
};

export const toggleBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(await adminService.toggleUserBan(actorId, req.params.id as string));
  } catch (err) { next(err); }
};

export const getAllManagers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = paginationSchema.parse(req.query);
    const { verified } = req.query as { verified?: string };
    res.json(await adminService.getAllManagers(page, limit, verified, search));
  } catch (err) { next(err); }
};

export const createManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.createManager(actorId, req.body), 'Manager created successfully'));
  } catch (err) { next(err); }
};

export const updateManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    res.json(successResponse(await adminService.updateManager(actorId, id, req.body), 'Manager updated successfully'));
  } catch (err) { next(err); }
};

export const deleteManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    await adminService.deleteManager(actorId, id);
    res.json(successResponse(null, 'Manager and related user deleted'));
  } catch (err) { next(err); }
};

export const toggleVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(await adminService.toggleManagerVerification(actorId, req.params.id as string));
  } catch (err) { next(err); }
};

export const getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { status } = req.query as { status?: string };
    res.json(await adminService.getAllRequests(page, limit, status));
  } catch (err) { next(err); }
};

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.createRequest(actorId, req.body), 'Request created successfully'));
  } catch (err) { next(err); }
};

export const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    res.json(successResponse(await adminService.updateRequest(actorId, id, req.body), 'Request updated successfully'));
  } catch (err) { next(err); }
};

export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    await adminService.deleteRequest(actorId, id);
    res.json(successResponse(null, 'Request deleted'));
  } catch (err) { next(err); }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await adminService.getAnalytics());
  } catch (err) { next(err); }
};

export const getSystemConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await adminService.getSystemConfig()));
  } catch (err) { next(err); }
};

export const updateSystemConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.updateSystemConfig(actorId, req.body)));
  } catch (err) { next(err); }
};

export const getAllBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await adminService.getAllBadges()));
  } catch (err) { next(err); }
};

export const createBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.createBadge(actorId, req.body), 'Badge created successfully'));
  } catch (err) { next(err); }
};

export const updateBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    res.json(successResponse(await adminService.updateBadge(actorId, id, req.body), 'Badge updated successfully'));
  } catch (err) { next(err); }
};

export const deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    await adminService.deleteBadge(actorId, id);
    res.json(successResponse(null, 'Badge deleted'));
  } catch (err) { next(err); }
};

export const getAllRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await adminService.getAllRewards()));
  } catch (err) { next(err); }
};

export const createReward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    res.json(successResponse(await adminService.createReward(actorId, req.body), 'Incentive deployed to treasury'));
  } catch (err) { next(err); }
};

export const updateReward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    const id = req.params.id as string;
    res.json(successResponse(await adminService.updateReward(actorId, id, req.body), 'Incentive updated successfully'));
  } catch (err) { next(err); }
};

export const deleteReward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    await adminService.deleteReward(actorId, req.params.id as string);
    res.json(successResponse(null, 'Incentive decommissioned'));
  } catch (err) { next(err); }
};

export const getAllDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    res.json(await adminService.getAllDonations(page, limit));
  } catch (err) { next(err); }
};

export const deleteDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = (req as any).user.id;
    await adminService.deleteDonation(actorId, req.params.id as string);
    res.json(successResponse(null, 'Donation record deleted'));
  } catch (err) { next(err); }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    res.json(await adminService.getAuditLogs(page, limit));
  } catch (err) { next(err); }
};

export const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entity } = req.params;
    let data;
    switch (entity) {
      case 'users':
        data = (await adminService.getAllUsers(1, 1000)).data;
        break;
      case 'managers':
        data = (await adminService.getAllManagers(1, 1000)).data;
        break;
      case 'requests':
        data = (await adminService.getAllRequests(1, 1000)).data;
        break;
      case 'donations':
        data = (await adminService.getAllDonations(1, 1000)).data;
        break;
      case 'rewards':
        data = await adminService.getAllRewards();
        break;
      case 'badges':
        data = await adminService.getAllBadges();
        break;
      case 'logs':
        data = (await adminService.getAuditLogs(1, 1000)).data;
        break;
      default:
        throw new Error('Invalid entity');
    }
    
    const csv = jsonToCsv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${entity}_export_${new Date().toISOString()}.csv`);
    return res.send(csv);
  } catch (err) { next(err); }
};

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await adminService.getUserDetail(req.params.id as string));
  } catch (err) { next(err); }
};

export const getManagerDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await adminService.getManagerDetail(req.params.id as string));
  } catch (err) { next(err); }
};
