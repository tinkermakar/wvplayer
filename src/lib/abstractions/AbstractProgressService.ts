import { Type, type Static } from '@sinclair/typebox';
import { ProgressRecord } from '../types/types';

export const progressUpsertPayload = Type.Object({
  time: Type.Number(),
  total: Type.Number(),
  pathStr: Type.String(),
});

export type ProgressUpsertPayload = Static<typeof progressUpsertPayload>;

export abstract class AbstractProgressService {
  abstract upsert(upsertPayload: ProgressUpsertPayload): Promise<void>;
  abstract get(progressFilePath: string): Promise<ProgressRecord[]>;
  abstract delete(progressFilePath: string, name: string): Promise<void>;
}
