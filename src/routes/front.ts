import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { breakPath, breadcrumbMaker, dirContent } from '../lib/utils/utils';
import { Record } from '../lib/types/types';
import { config } from '../lib/config/config';

export const frontRouter = Router();

frontRouter.get('*mp4/player', async (req, res) => {
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

  const src = path.join('/api/', ...pathArr);
  const subtitleSrc = src.replace('.mp4', '.vtt');
  const back = path.join('/', ...parentPathArr);
  const dir = parentPathArr[parentPathArr.length - 1];
  const nextVideo = nextVideoName
    ? path.join('/', ...parentPathArr, nextVideoName, 'player')
    : null;

  res.render('player', { name, dir, src, subtitleSrc, startTime, back, nextVideo });
});

frontRouter.get('*', async (req, res, next) => {
  const webPath = req.path === '/' ? '' : decodeURI(req.path);
  const fullPath = path.join(config.rootDir || '/dev/null', webPath);
  if (fs.existsSync(fullPath)) {
    const progressFilePath = path.join(fullPath, 'progress.json');
    const progressFile = fs.existsSync(progressFilePath)
      ? JSON.parse(fs.readFileSync(progressFilePath)?.toString())
      : null;
    const ls = fs.readdirSync(fullPath);
    const lsPlus = ls.map(name => {
      const isDir = !fs.statSync(path.join(fullPath, name)).isFile();
      const isVideo = !isDir && name.endsWith('.mp4');

      // eslint-disable-next-line no-nested-ternary
      const url = isDir ? `${webPath}/${name}` : isVideo ? `${webPath}/${name}/player` : null;

      let progress = null;

      if (isVideo) {
        const record = progressFile?.find((el: Record) => el.name === name);
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
    const output = { breadcrumb, directories, videos, other };
    // console.info(output);
    return res.render('index', output);
  }

  // catch 404 and forward to error handler
  next({ status: 404 });
});
