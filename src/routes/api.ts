import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath, compare } from '../lib/utils/utils';
import { Record } from '../lib/types/types';
import { config } from '../lib/config/config';

export const apiRouter = Router();

// Credit: https://github.com/thesmartcoder7/video_streaming_server
apiRouter.get('/*mp4', async (req, res, next) => {
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
});

apiRouter.get('*vtt', async (req, res) => {
  const { pathArr } = breakPath(req.path);
  const src = path.join(config.rootDir || '/dev/null', ...pathArr).replace('.mp4', '.vtt');
  res.sendFile(src);
});

apiRouter.post('/progress-tracker', async (req, res) => {
  const { time, total, pathStr } = req.body;

  if (time && total && pathStr) {
    const { name, progressFilePath } = breakPath(pathStr);

    const initial: Record[] = fs.existsSync(progressFilePath)
      ? JSON.parse(fs.readFileSync(progressFilePath).toString())
      : [];

    const newRecord = { name, total, time };
    const existing: Record | undefined = initial.find((el: Record) => el.name === name);

    let newFile = [];
    if (existing) {
      const filtered = initial.filter((el: Record) => el.name !== name);
      newFile = [...filtered, newRecord];
    } else newFile = [...initial, newRecord];

    const newFileSorted = newFile.sort(compare);
    const newFileFinal = JSON.stringify(newFileSorted, null, 2);

    fs.writeFileSync(progressFilePath, newFileFinal);
  }

  res.json(['time-tracker']);
});
