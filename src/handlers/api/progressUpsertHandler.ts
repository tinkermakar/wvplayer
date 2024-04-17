import { Request, Response, NextFunction } from 'express';
import { progressService } from '../../services/progressService';

export const progressUpsertHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { time, total, pathStr } = req.body;
    await progressService.upsert({ time, total, pathStr });
    res.sendStatus(204);
  } catch (err) {
    res.locals.isApiError = true;
    next(err);
  }
};
