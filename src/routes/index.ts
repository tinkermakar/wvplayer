import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath, breadcrumbMaker, compare, dirContent } from '@/common/utils';
import { Record } from '@/common/types';

const router = Router();

router.get('*mp4/player', async (req, res) => {
  const { name, pathArr, progressFilePath, parentDir, parentPathArr } = breakPath(req.path);

  let startTime = 0;
  if (fs.existsSync(progressFilePath)) {
    const progressFile = JSON.parse(fs.readFileSync(progressFilePath).toString());
    const record = progressFile.find((el: Record) => el.name === name);
    if (record) startTime = record.time;
  }

  const lsPlus = await dirContent(parentDir);
  const videos = lsPlus.filter(el => el.isVideo);
  const currentVideoIndex = videos.findIndex(el => el.name === name);
  const nextVideoName = videos?.[currentVideoIndex + 1]?.name;

  const src = path.join('/', ...pathArr);
  const back = path.join('/', ...parentPathArr);
  const dir = parentPathArr[parentPathArr.length - 1];
  const nextVideo = nextVideoName
    ? path.join('/', ...parentPathArr, nextVideoName, 'player')
    : null;

  res.render('player', { name, dir, src, startTime, back, nextVideo });
});

// Took from: https://github.com/thesmartcoder7/video_streaming_server
router.get('*mp4', async (req, res) => {
  const { pathArr } = breakPath(req.path);
  const src = path.join(process.env.LAST_ROOT_DIR || '/dev/null', ...pathArr);
  const videoSize = fs.statSync(src).size;

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
  }
  else {
    const head2 = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': videoSize,
    };
    res.writeHead(200, head2);
    fs.createReadStream(src).pipe(res);
  }
});

router.post('/progress-tracker', async (req, res) => {
  const { time, pathStr } = req.body;

  if (time && pathStr) {
    const { name, progressFilePath } = breakPath(pathStr);

    const initial: Record[] = fs.existsSync(progressFilePath)
      ? JSON.parse(fs.readFileSync(progressFilePath).toString())
      : [];

    const newRecord = { name, time };
    const existing: Record | undefined = initial.find((el: Record) => el.name === name);

    let newFile = [];
    if (existing) {
      const filtered = initial.filter((el: Record) => el.name !== name);
      newFile = [...filtered, newRecord];
    }
    else newFile = [...initial, newRecord];

    const newFileSorted = newFile.sort(compare);
    const newFileFinal = JSON.stringify(newFileSorted, null, 2);

    fs.writeFileSync(progressFilePath, newFileFinal);
  }

  res.json(['time-tracker']);
});

router.get('*', async (req, res) => {
  const webPath = req.path === '/'
    ? ''
    : decodeURI(req.path);
  const fullPath = path.join(process.env.LAST_ROOT_DIR || '/dev/null', webPath);
  if (fs.existsSync(fullPath)) {
    const ls = fs.readdirSync(fullPath);
    const lsPlus = ls.map(name => {
      const isDir = !fs.statSync(path.join(fullPath, name)).isFile();
      const isVideo = !isDir && name.endsWith('.mp4');

      // eslint-disable-next-line no-nested-ternary
      const url = isDir
        ? `${webPath}/${name}`
        : isVideo
          ? `${webPath}/${name}/player`
          : null;

      return { name, isDir, isVideo, url };
    });

    const directories = lsPlus.filter(el => el.isDir);
    const videos = lsPlus.filter(el => el.isVideo);
    const other = lsPlus.filter(el => !el.isDir && !el.isVideo);

    const breadcrumb = breadcrumbMaker(webPath);
    const output: any = { breadcrumb, directories, videos, other };
    // console.info(output);
    return res.render('index', output);
  }
  return res.send('Wrong Way!');
});

export default router;
