import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authLimiter } from '../../middlewares/rateLimiter';

export const authRouter = Router();

authRouter.get('/check-phone', authLimiter, authController.checkPhone);
authRouter.post('/register', authLimiter, authController.register);
authRouter.get('/verify-email', authController.verifyEmail);
authRouter.post('/login', authLimiter, authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.getMe);
