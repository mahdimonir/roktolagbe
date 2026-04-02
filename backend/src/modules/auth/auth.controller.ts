import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { registerSchema, loginSchema } from './auth.schema';
import { AuthRequest } from '../../middlewares/authenticate';
import { successResponse } from '../../utils/helpers';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const checkPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.query as { phone: string };
    const result = await authService.checkPhone(phone);
    res.json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, id } = req.query as { token: string; id: string };
    const result = await authService.verifyEmail(token, id);
    res.json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await authService.login(input);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json(successResponse({ accessToken, user }, 'Login successful'));
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json(successResponse({ accessToken: tokens.accessToken }));
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json(successResponse(null, 'Logged out successfully'));
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json(successResponse(user));
  } catch (err) {
    next(err);
  }
};
