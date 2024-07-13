import { Router } from 'express';
import { videoPlayerHandler } from '../handlers/front/videoPlayerHandler';
import { browserHandler } from '../handlers/front/browserHandler';
import { resetDirHandler } from '../handlers/front/resetDirHandler';

export const frontRouter = Router();

frontRouter.get('*mp4/player', videoPlayerHandler);
frontRouter.get('*', browserHandler);
frontRouter.post(/^(?!.*mp4\/player$).*/, resetDirHandler);
