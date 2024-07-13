import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../lib/config/config';

export const resetDirHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webPath = req.path === '/' ? '' : decodeURI(req.path);
    const fullPath = path.join(config.rootDir || '/dev/null', webPath);
    if (!fs.existsSync(fullPath)) next({ status: 404 });

    const progressFilePath = path.join(fullPath, 'progress.json');
    await fs.promises.unlink(progressFilePath).catch(err => console.error(err));

    return res.redirect(req.path);
  } catch (err) {
    next(err);
  }
};
