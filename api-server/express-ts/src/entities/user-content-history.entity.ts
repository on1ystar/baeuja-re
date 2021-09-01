import { pool } from '../db';

export class UserContentHistory {
  constructor(
    readonly userId?: number,
    readonly contentId?: number,
    readonly counts?: number,
    readonly latestLearningAt?: string,
    readonly learningTime?: string,
    readonly progressRate?: number
  ) {}
}
