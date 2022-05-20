import path from 'path';
import { Record, BrokenPath } from '@/types/global.types';

export const compare = (a: Record, b: Record): number => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const breakPath = (pathStr: string): BrokenPath => {
  const pathArr = pathStr.split('/');
  pathArr.pop();
  const name = pathArr.reverse()[0];
  const progressFilePath = path.join(process.env.VIDEOS_ROOT || '/dev/null', ...pathArr, '..', 'progress.json');

  return { name, pathArr, progressFilePath };
};
