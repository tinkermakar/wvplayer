import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { breakPath } from '../../lib/utils/utils.ts';
import { config } from '../../lib/config/config.ts';

// Credit: https://github.com/thesmartcoder7/video_streaming_server
export const videoGetHandler = (req: Request, res: Response, next: NextFunction) => {
  const { pathArr } = breakPath(req.path);
  res.sendFile(path.join(...pathArr), { root: path.resolve(config.rootDir) }, err => {
    if (err) {
      res.locals.isApiError = true;
      next(err);
    }
  });
};
