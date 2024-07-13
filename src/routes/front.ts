import { Router } from 'express';
import { videoPlayerHandler } from '../handlers/front/videoPlayerHandler';
import { browserHandler } from '../handlers/front/browserHandler';
import { resetDirHandler } from '../handlers/front/resetDirHandler';
import { resetVideoHandler } from '../handlers/front/resetVideoHandler';

export const frontRouter = Router();

frontRouter
  .get('*mp4/player', videoPlayerHandler)
  .post('*mp4/player', resetVideoHandler)
  .get('*', browserHandler)
  .post('*', resetDirHandler);
