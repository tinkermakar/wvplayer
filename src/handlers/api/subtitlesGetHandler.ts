import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { breakPath } from '../../lib/utils/utils';
import { config } from '../../lib/config/config';

export const subtitlesGetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pathArr } = breakPath(req.path);
    const src = path.join(config.rootDir || '/dev/null', ...pathArr).replace('.mp4', '.vtt');
    res.sendFile(src);
  } catch (err) {
    res.locals.isApiError = true;
    next(err);
  }
};
