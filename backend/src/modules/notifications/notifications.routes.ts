import { Router } from 'express';
import * as notifController from './notifications.controller';
import { authenticate } from '../../middlewares/authenticate';

export const notificationRouter = Router();

notificationRouter.use(authenticate);
notificationRouter.get('/', notifController.getMyNotifications);
notificationRouter.patch('/read-all', notifController.markAllAsRead);
notificationRouter.patch('/:id/read', notifController.markAsRead);
