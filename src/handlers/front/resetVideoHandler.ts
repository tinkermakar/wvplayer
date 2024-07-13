import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { breakPath } from '../../lib/utils/utils';
import { ProgressRecord } from '../../lib/types/types';
import { progressService } from '../../services/progressService';

export const resetVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, progressFilePath } = breakPath(req.path);

    if (fs.existsSync(progressFilePath)) {
      const progressFile = JSON.parse(fs.readFileSync(progressFilePath).toString());
      const record = progressFile.find((el: ProgressRecord) => el.name === name);
      if (record) await progressService.upsert({ time: 0, total: 100, pathStr: req.path });
    }

    return res.redirect(req.path);
  } catch (err) {
    next(err);
  }
};
