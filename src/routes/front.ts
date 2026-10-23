import { Router } from 'express';
import { videoPlayerHandler } from '../handlers/front/videoPlayerHandler.ts';
import { browserHandler } from '../handlers/front/browserHandler.ts';
import { resetDirHandler } from '../handlers/front/resetDirHandler.ts';
import { resetVideoHandler } from '../handlers/front/resetVideoHandler.ts';

export const frontRouter = Router();

frontRouter
  .get(/\.mp4\/player$/, videoPlayerHandler)
  .post(/\.mp4\/player$/, resetVideoHandler)
  .get('/{*path}', browserHandler)
  .post('/{*path}', resetDirHandler);
