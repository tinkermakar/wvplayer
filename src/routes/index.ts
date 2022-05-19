import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const router = Router();

router.get('*mp4/player', async (req, res) => {
  const regex = /(.*.mp4)\/player/;

  const root = '/home/makar2/_apps/local-area-streamer/videos';

  const urlFinal = regex.exec(req.path)?.[1] || '';
  const pathArr = urlFinal.split('/');

  const src = path.join(root, ...pathArr);

  // res.render('player', { src: pathArr });
  res.render('player', { src: urlFinal, startTime: 3 });
});

router.get('*mp4', async (req, res) => {
  const root = '/home/makar2/_apps/local-area-streamer/videos';

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
  console.log(req.body?.path);

  res.json(['time-tracker']);
});

router.get('*', async (req, res) => {
  const root = '/home/makar2/Downloads/_watch';

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
