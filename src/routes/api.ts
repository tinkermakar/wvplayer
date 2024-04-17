import { Router } from 'express';
import { validateProgressTracker } from '../middleware/validation/apiValidate';
import { videoGetHandler } from '../handlers/api/videoGetHandler';
import { subtitlesGetHandler } from '../handlers/api/subtitlesGetHandler';
import { progressUpsertHandler } from '../handlers/api/progressUpsertHandler';

export const apiRouter = Router();

apiRouter
  .get('/*mp4', videoGetHandler)
  .get('*vtt', subtitlesGetHandler)
  .post('/progress-tracker', validateProgressTracker, progressUpsertHandler);
