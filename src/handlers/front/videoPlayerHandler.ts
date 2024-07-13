import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { cryptoService } from '../../services/cryptoService';
import { config } from '../../lib/config/config';
import { breakPath, dirContent } from '../../lib/utils/utils';
import { ProgressRecord } from '../../lib/types/types';

export const videoPlayerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, pathArr, progressFilePath, parentDir, parentPathArr } = breakPath(req.path);

    let startTime = 0;
    if (fs.existsSync(progressFilePath)) {
      const progressFile = JSON.parse(fs.readFileSync(progressFilePath).toString());
      const record = progressFile.find((el: ProgressRecord) => el.name === name);
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

    const chromecastToken = cryptoService.generateToken(config.username);

    res.render('player', {
      name,
      dir,
      src,
      chromecastToken,
      subtitleSrc,
      startTime,
      back,
      nextVideo,
      hasProgressFile: true,
    });
  } catch (err) {
    next(err);
  }
};
