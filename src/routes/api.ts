import { Router } from 'express';
import { validateProgressTracker } from '../middleware/validation/apiValidate.ts';
import { videoGetHandler } from '../handlers/api/videoGetHandler.ts';
import { subtitlesGetHandler } from '../handlers/api/subtitlesGetHandler.ts';
import { progressUpsertHandler } from '../handlers/api/progressUpsertHandler.ts';

export const apiRouter = Router();

apiRouter
  .get(/\.mp4$/, videoGetHandler)
  .get(/\.vtt$/, subtitlesGetHandler)
  .post('/progress-tracker', validateProgressTracker, progressUpsertHandler);
