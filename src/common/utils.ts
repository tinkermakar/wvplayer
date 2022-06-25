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
  const pathArr = decodeURI(pathStr).split('/');
  if (pathArr[pathArr.length - 1] === 'player' && pathArr[pathArr.length - 2].endsWith('.mp4')) {
    pathArr.pop();
  }

  const name = pathArr[pathArr.length - 1];
  const progressFilePath = path.join(process.env.LAST_ROOT_DIR || '/dev/null', ...pathArr, '..', 'progress.json');

  return { name, pathArr, progressFilePath };
};

export const breadcrumbMaker = (whereAmI: string): { name: string, url: string}[] => {
  const breadcrumb = [
    { name: '/', url: '/' },
  ];
  const { pathArr } = breakPath(whereAmI);
  for (let i = 1; i < pathArr.length; i++) {
    const name = pathArr[i];
    const url = pathArr.slice(0, i + 1).join('/');
    breadcrumb.push({ name, url });
  }
  return breadcrumb;
};
