import fs from 'fs';
import path from 'path';
import { Record, BrokenPath, LsPlus } from './types';
import { config } from '../lib/config/config';

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
  const rawPathArr = decodeURI(pathStr).split('/');
  const pathArr =
    rawPathArr[rawPathArr.length - 1] === 'player' &&
    rawPathArr[rawPathArr.length - 2].endsWith('.mp4')
      ? rawPathArr.slice(0, -1)
      : rawPathArr;

  const parentPathArr = pathArr.slice(0, -1);
  const name = pathArr[pathArr.length - 1];
  const parentDir = path.join(config.rootDir || '/dev/null', ...pathArr, '..');
  const progressFilePath = path.join(parentDir, 'progress.json');

  return { name, pathArr, progressFilePath, parentDir, parentPathArr };
};

export const breadcrumbMaker = (whereAmI: string): { name: string; url: string }[] => {
  const breadcrumb = [{ name: '/', url: '/' }];
  const { pathArr } = breakPath(whereAmI);
  for (let i = 1; i < pathArr.length; i++) {
    const name = pathArr[i];
    const url = pathArr.slice(0, i + 1).join('/');
    breadcrumb.push({ name, url });
  }
  return breadcrumb;
};

export const dirContent = async (dirPath: string): Promise<LsPlus[]> => {
  const ls = fs.readdirSync(dirPath);
  const lsPlus = ls.map(name => {
    const isDir = !fs.statSync(path.join(dirPath, name)).isFile();
    const isVideo = !isDir && name.endsWith('.mp4');

    return { name, isDir, isVideo };
  });

  return lsPlus;
};
