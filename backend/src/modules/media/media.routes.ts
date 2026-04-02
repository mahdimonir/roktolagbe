import { Router } from 'express';
import * as mediaController from './media.controller';

export const mediaRouter = Router();

mediaRouter.get('/saved-lives', mediaController.getSavedLives);
