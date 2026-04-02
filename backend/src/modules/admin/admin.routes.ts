import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize('ADMIN'));

// Users
adminRouter.get('/users', adminController.getAllUsers);
adminRouter.post('/users', adminController.createUser);
adminRouter.patch('/users/:id', adminController.updateUser);
adminRouter.delete('/users/:id', adminController.deleteUser);
adminRouter.get('/users/:id', adminController.getUserDetail);
adminRouter.patch('/users/:id/ban', adminController.toggleBan);

// Managers
adminRouter.get('/managers', adminController.getAllManagers);
adminRouter.post('/managers', adminController.createManager);
adminRouter.patch('/managers/:id', adminController.updateManager);
adminRouter.delete('/managers/:id', adminController.deleteManager);
adminRouter.get('/managers/:id', adminController.getManagerDetail);
adminRouter.patch('/managers/:id/verify', adminController.toggleVerification);

// Requests
adminRouter.get('/requests', adminController.getAllRequests);
adminRouter.post('/requests', adminController.createRequest);
adminRouter.patch('/requests/:id', adminController.updateRequest);
adminRouter.delete('/requests/:id', adminController.deleteRequest);

// Rewards
adminRouter.get('/rewards', adminController.getAllRewards);
adminRouter.post('/rewards', adminController.createReward);
adminRouter.patch('/rewards/:id', adminController.updateReward);
adminRouter.delete('/rewards/:id', adminController.deleteReward);

// Badges
adminRouter.get('/badges', adminController.getAllBadges);
adminRouter.post('/badges', adminController.createBadge);
adminRouter.patch('/badges/:id', adminController.updateBadge);
adminRouter.delete('/badges/:id', adminController.deleteBadge);

// Reports & Analytics
adminRouter.get('/export/:entity', adminController.exportData);
adminRouter.get('/analytics', adminController.getAnalytics);
adminRouter.get('/config', adminController.getSystemConfig);
adminRouter.patch('/config', adminController.updateSystemConfig);

// Donations Archive
adminRouter.get('/donations', adminController.getAllDonations);
adminRouter.delete('/donations/:id', adminController.deleteDonation);

// Security Audit
adminRouter.get('/audit-logs', adminController.getAuditLogs);
