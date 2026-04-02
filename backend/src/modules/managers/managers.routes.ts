import { Router } from 'express';
import * as managerController from './managers.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const managerRouter = Router();

managerRouter.get('/', managerController.getManagers);
managerRouter.get('/me', authenticate, authorize('MANAGER'), managerController.getMyProfile);
managerRouter.patch('/me', authenticate, authorize('MANAGER'), managerController.updateMyProfile);
managerRouter.get('/me/members', authenticate, authorize('MANAGER'), managerController.getMembers);
managerRouter.get('/me/analytics', authenticate, authorize('MANAGER'), managerController.getAnalytics);
managerRouter.get('/me/strategic-recruits', authenticate, authorize('MANAGER'), managerController.getStrategicRecruits);
managerRouter.post('/me/members', authenticate, authorize('MANAGER'), managerController.addMember);
managerRouter.delete('/me/members/:memberId', authenticate, authorize('MANAGER'), managerController.removeMember);
managerRouter.get('/me/inventory', authenticate, authorize('MANAGER'), managerController.getInventory);
managerRouter.post('/me/inventory', authenticate, authorize('MANAGER'), managerController.updateInventory);
managerRouter.get('/me/inventory/logs', authenticate, authorize('MANAGER'), managerController.getInventoryLogs);
managerRouter.get('/invite/:token', managerController.resolveInvite);
managerRouter.get('/:id', managerController.getManagerById);
