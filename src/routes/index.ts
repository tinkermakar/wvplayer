import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath, compare, breadcrumbMaker } from '@/common/utils';
import { Record } from '@/types/global.types';

const router = Router();

router.get('*mp4/player', async (req, res) => {
  const { name, pathArr, progressFilePath } = breakPath(req.path);

  let startTime = 0;
  if (fs.existsSync(progressFilePath)) {
    const progressFile = JSON.parse(fs.readFileSync(progressFilePath).toString());
    const record = progressFile.find((el: Record) => el.name === name);
    if (record) startTime = record.time;
  }

  const src = path.join('/', ...pathArr);
  res.render('player', { src, startTime });
});

router.get('*mp4', async (req, res) => {
  const { pathArr } = breakPath(req.path);
  const src = path.join(process.env.ROOT_DIR || '/dev/null', ...pathArr);
  const stat = fs.statSync(src);
  const fileSize = stat.size;

  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
  };
  res.writeHead(200, head);
  fs.createReadStream(src).pipe(res);
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
  const fullPath = path.join(process.env.ROOT_DIR || '/dev/null', webPath);
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
