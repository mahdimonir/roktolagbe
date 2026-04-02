import { Request, Response, NextFunction } from 'express';
import * as mediaService from './media.service';
import { paginationSchema } from '../../utils/helpers';

export const getSavedLives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    res.json(await mediaService.getSavedLives(page, limit));
  } catch (err) { next(err); }
};
