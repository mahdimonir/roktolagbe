import { Response, NextFunction } from 'express';
import * as messageService from './messages.service';
import { sendMessageSchema } from './messages.schema';
import { AuthRequest } from '../../middlewares/authenticate';
import { successResponse } from '../../utils/helpers';

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(successResponse(await messageService.getConversations(req.user!.id)));
  } catch (err) { next(err); }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contactId = req.params.contactId as string;
    res.json(successResponse(await messageService.getMessages(req.user!.id, contactId)));
  } catch (err) { next(err); }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { receiverId, content } = sendMessageSchema.parse(req.body);
    res.status(201).json(successResponse(await messageService.sendMessage(req.user!.id, receiverId, content)));
  } catch (err) { next(err); }
};
