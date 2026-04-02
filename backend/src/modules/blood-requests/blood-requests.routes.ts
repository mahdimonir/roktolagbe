import { Router } from 'express';
import * as bloodRequestController from './blood-requests.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const bloodRequestRouter = Router();

bloodRequestRouter.get('/', bloodRequestController.getRequests);
bloodRequestRouter.get('/:id', bloodRequestController.getRequestById);
bloodRequestRouter.get('/:id/shortlist', authenticate, bloodRequestController.getShortlistedDonors);
bloodRequestRouter.post('/emergency', bloodRequestController.createEmergencyRequest);
bloodRequestRouter.post('/', authenticate, authorize('MANAGER'), bloodRequestController.createRequest);
bloodRequestRouter.patch('/:id', authenticate, authorize('MANAGER', 'ADMIN'), bloodRequestController.updateRequest);
bloodRequestRouter.delete('/:id', authenticate, authorize('MANAGER', 'ADMIN'), bloodRequestController.deleteRequest);
bloodRequestRouter.post('/:id/commit', authenticate, bloodRequestController.commitToRequest);
bloodRequestRouter.patch('/verify/:donationId', authenticate, authorize('MANAGER'), bloodRequestController.verifyDonation);
