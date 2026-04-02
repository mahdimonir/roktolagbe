import { Request, Response, NextFunction } from 'express';
import * as notifService from './notifications.service';
import { AuthRequest } from '../../middlewares/authenticate';
import { paginationSchema } from '../../utils/helpers';

export const getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    res.json(await notifService.getMyNotifications(req.user!.id, page, limit));
  } catch (err) { next(err); }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await notifService.markAsRead(req.user!.id, req.params.id as string));
  } catch (err) { next(err); }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await notifService.markAllAsRead(req.user!.id));
  } catch (err) { next(err); }
};
