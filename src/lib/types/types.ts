export interface Err {
  status?: number;
  message?: string;
}

export interface Record {
  name: string;
  time: string;
}

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
