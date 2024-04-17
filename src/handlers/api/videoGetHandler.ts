import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath } from '../../lib/utils/utils';
import { config } from '../../lib/config/config';

// Credit: https://github.com/thesmartcoder7/video_streaming_server
export const videoGetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pathArr } = breakPath(req.path);
    const src = path.join(config.rootDir || '/dev/null', ...pathArr);

    if (!fs.existsSync(src)) return next({ code: 404 });
    const videoSize = fs.statSync(src)?.size;
    if (!videoSize) return next({ code: 500 });

    const { range } = req.headers;
    if (range) {
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range?.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;

      const head1 = {
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Content-Length': contentLength,
      };

      res.writeHead(206, head1);
      fs.createReadStream(src, { start, end }).pipe(res);
    } else {
      const head2 = {
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Content-Length': videoSize,
      };
      res.writeHead(200, head2);
      fs.createReadStream(src).pipe(res);
    }
  } catch (err) {
    res.locals.isApiError = true;
    next(err);
  }
};
