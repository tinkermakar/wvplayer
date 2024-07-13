import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { breadcrumbMaker } from '../../lib/utils/utils';
import { config } from '../../lib/config/config';
import { ProgressRecord } from '../../lib/types/types';

export const browserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webPath = req.path === '/' ? '' : decodeURI(req.path);
    const fullPath = path.join(config.rootDir || '/dev/null', webPath);
    if (fs.existsSync(fullPath)) {
      const progressFilePath = path.join(fullPath, 'progress.json');
      const progressFile = fs.existsSync(progressFilePath)
        ? JSON.parse(fs.readFileSync(progressFilePath)?.toString())
        : null;
      const hasProgressFile = !!progressFile;

      const ls = fs.readdirSync(fullPath);
      const lsPlus = ls.map(name => {
        const isDir = !fs.statSync(path.join(fullPath, name)).isFile();
        const isVideo = !isDir && name.endsWith('.mp4');

        // eslint-disable-next-line no-nested-ternary
        const url = isDir ? `${webPath}/${name}` : isVideo ? `${webPath}/${name}/player` : null;

        let progress = null;

        if (isVideo) {
          const record = progressFile?.find((el: ProgressRecord) => el.name === name);
          if (record) {
            const { time, total } = record;
            if (time && total) {
              progress = Math.ceil((time / total) * 100);
            } else if (time) {
              // backwards compatibility
              // show 0% if there is some progress but total is unknown
              progress = 0;
            }
          }
        }

        return { name, isDir, isVideo, url, progress };
      });

      const directories = lsPlus.filter(el => el.isDir);
      const videos = lsPlus.filter(el => el.isVideo);
      const other = lsPlus.filter(el => !el.isDir && !el.isVideo);

      const breadcrumb = breadcrumbMaker(webPath);
      const output = { breadcrumb, directories, videos, other, hasProgressFile };
      // console.info(output);
      return res.render('index', output);
    }

    // catch 404 and forward to error handler
    next({ status: 404 });
  } catch (err) {
    next(err);
  }
};
