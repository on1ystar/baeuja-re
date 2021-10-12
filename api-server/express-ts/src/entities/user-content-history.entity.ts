/**
  @description user_content_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/

export default class UserContentHistory {
  constructor(
    readonly userId?: number,
    readonly contentId?: number,
    readonly counts?: number,
    readonly latestLearningAt?: string,
    readonly learningTime?: string,
    readonly progressRate?: number
  ) {}
}

export interface UserContentHistoryPK extends UserContentHistory {
  readonly userId: number;
  readonly contentId: number;
}
