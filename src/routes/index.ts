import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath, compare } from '@/common/utils';
import { Record } from '@/types/global.types';

const router = Router();

// const root = '/home/makar2/Downloads/_watch';
process.env.VIDEOS_ROOT = '/home/makar2/_apps/local-area-streamer/videos';
const root = process.env.VIDEOS_ROOT || '/dev/null';

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
  const pathArr = req.path.split('/');

  const src = path.join(root, ...pathArr);

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
  // const pathInitial: any = Object.values(req.params)[0];
  // const pathArr = pathInitial.split('/');
  // return res.send(path.join(root, ...pathArr));
  const pathArr = req.path.split('/');

  return res.render('index', { url: path.join(root, ...pathArr, 'xyz') });

  // const readdirAsync = promisify(fs.readdir);
  // const writeFileAsync = promisify(fs.writeFile);

  const ls = await fs.readdirSync(root);
  ls.push('../lambda-workflows-controller-dev-4c331e86-2c32-46a7-89d7-09a33258e669.zip');

  const output = ls.map(el => {
    const isFile = fs.statSync(path.join(root, el)).isFile();
    return { file: el, isFile };
  });
  res.json(output);
});

export default router;
