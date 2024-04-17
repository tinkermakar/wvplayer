import { Type, type Static } from '@sinclair/typebox';

export const progressRecord = Type.Object({
  name: Type.String(),
  time: Type.Number(),
  total: Type.Number(),
});

export type ProgressRecord = Static<typeof progressRecord>;

export interface BrokenPath {
  name: string;
  pathArr: string[];
  progressFilePath: string;
  parentDir: string;
  parentPathArr: string[];
}

export interface LsPlus {
  name: string;
  isDir: boolean;
  isVideo: boolean;
}
