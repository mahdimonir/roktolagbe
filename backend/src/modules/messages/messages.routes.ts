import { Router } from 'express';
import * as messageController from './messages.controller';
import { authenticate } from '../../middlewares/authenticate';

export const messageRouter = Router();

messageRouter.use(authenticate);

messageRouter.get('/conversations', messageController.getConversations);
messageRouter.get('/:contactId', messageController.getMessages);
messageRouter.post('/', messageController.sendMessage);
