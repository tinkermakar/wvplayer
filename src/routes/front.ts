import { Router } from 'express';
import { videoPlayerHandler } from '../handlers/front/videoPlayerHandler';
import { browserHandler } from '../handlers/front/browserHandler';

export const frontRouter = Router();

frontRouter.get('*mp4/player', videoPlayerHandler).get('*', browserHandler);
