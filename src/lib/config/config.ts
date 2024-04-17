import { Problem } from '../utils/errorHandling';

const { IS_DOCKER, WVPLAYER_PORT, WVPLAYER_ROOT_DIR, WVPLAYER_USERNAME, WVPLAYER_PASSWORD } =
  process.env;

if (!WVPLAYER_PORT || !WVPLAYER_ROOT_DIR || !WVPLAYER_USERNAME || !WVPLAYER_PASSWORD) {
  throw new Problem('misconfigured', 500);
}

const rootDir = IS_DOCKER ? '/usr/src/wvplayer-data' : WVPLAYER_ROOT_DIR;
const port = IS_DOCKER ? 3000 : WVPLAYER_PORT;

export const config = {
  rootDir,
  port,
  username: WVPLAYER_USERNAME,
  password: WVPLAYER_PASSWORD,
} as const;
