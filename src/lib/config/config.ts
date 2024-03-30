import { Problem } from './errorHandling';

const { LAST_PORT, LAST_ROOT_DIR, LAST_USERNAME, LAST_PASSWORD } = process.env;

if (!LAST_PORT || !LAST_ROOT_DIR || !LAST_USERNAME || !LAST_PASSWORD) {
  throw new Problem('misconfigured', 500);
}

export const config = {
  port: LAST_PORT,
  rootDir: LAST_ROOT_DIR,
  username: LAST_USERNAME,
  password: LAST_PASSWORD,
} as const;
