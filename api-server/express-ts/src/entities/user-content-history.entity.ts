/**
  @description user_content_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/

export class UserContentHistoryPK {
  readonly userId?: number;

  readonly contentId?: number;
}

export default class UserContentHistory extends UserContentHistoryPK {
  constructor(
    readonly counts?: number,
    readonly learningTime?: string,
    readonly progressRate?: number,
    readonly latestLearningAt?: string
  ) {
    super();
  }
}
