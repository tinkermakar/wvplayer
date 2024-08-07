/* eslint-disable class-methods-use-this */
import { readFile, statfs, unlink, writeFile } from 'node:fs/promises';

import {
  AbstractProgressService,
  ProgressUpsertPayload,
} from '../lib/abstractions/AbstractProgressService';
import { breakPath } from '../lib/utils/utils';
import { progressRecord, type ProgressRecord } from '../lib/types/types';
import { validationService } from './validationService';
import { Problem } from '../lib/utils/errorHandling';

class ProgressService extends AbstractProgressService {
  async upsert({ time, total, pathStr }: ProgressUpsertPayload) {
    if (!pathStr) throw new Problem('Missing file path', 400);

    const { name, progressFilePath } = breakPath(pathStr);

    const initialFile = await this.get(progressFilePath);

    const newRecord = { name, total, time };
    const updatedFileLessNewRecord = ProgressService.#filterOutTarget(initialFile, name);
    const updatedFile = [...updatedFileLessNewRecord, newRecord];

    const updatedFileSorted = updatedFile.sort(ProgressService.#compare);
    const updatedFileStringified = JSON.stringify(updatedFileSorted, null, 2);

    await ProgressService.#write(progressFilePath, updatedFileStringified);
  }

  async get(progressFilePath: string): Promise<ProgressRecord[]> {
    const fileExists = await ProgressService.#fileExists(progressFilePath);
    if (!fileExists) return [];
    const fileString = await readFile(progressFilePath);
    const recordContent = JSON.parse(fileString.toString());
    validationService.validateData(progressRecord, recordContent);
    return recordContent;
  }

  async delete(progressFilePath: string, name: string) {
    const initialFile = await this.get(progressFilePath);
    if (!initialFile.length) throw new Problem('No progress records found', 404);

    const updatedFile = ProgressService.#filterOutTarget(initialFile, name);
    if (updatedFile?.length) {
      const updatedFileStringified = JSON.stringify(updatedFile, null, 2);
      await ProgressService.#write(progressFilePath, updatedFileStringified);
    } else await unlink(progressFilePath);
  }

  // PRIVATE HELPERS
  static async #write(filePath: string, content: string) {
    await writeFile(filePath, content);
  }

  static #filterOutTarget(recordContent: ProgressRecord[], name: string) {
    return recordContent.filter(el => el.name !== name);
  }

  static #compare = (a: ProgressRecord, b: ProgressRecord): number => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };

  static async #fileExists(path: string): Promise<boolean> {
    try {
      await statfs(path);
      return true;
    } catch {
      return false;
    }
  }
}

export const progressService = new ProgressService();
