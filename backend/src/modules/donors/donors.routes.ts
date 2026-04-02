import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as donorController from './donors.controller';
import { authenticate, optionalAuthenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

 // Multer has been removed for serverless compatibility (using direct Cloudinary uploads from frontend)

export const donorRouter = Router();

donorRouter.get('/', donorController.getDonors);
donorRouter.get('/search', optionalAuthenticate, donorController.searchDonors);
donorRouter.get('/me/analytics', authenticate, authorize('DONOR'), donorController.getAnalytics);
donorRouter.get('/me', authenticate, authorize('DONOR'), donorController.getMyProfile);
donorRouter.patch('/me', authenticate, authorize('DONOR'), donorController.updateMyProfile);
donorRouter.post('/me/donation', authenticate, authorize('DONOR'), donorController.logDonation);
donorRouter.get('/me/history', authenticate, authorize('DONOR'), donorController.getMyHistory);
donorRouter.get('/public/:id', optionalAuthenticate, donorController.getPublicDonorProfile);
donorRouter.get('/:id', authenticate, authorize('MANAGER', 'ADMIN'), donorController.getDonorById);
