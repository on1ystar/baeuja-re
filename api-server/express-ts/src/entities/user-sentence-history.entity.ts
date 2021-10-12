/**
  @description user_sentence_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/

export default class UserSentenceHistory {
  constructor(
    readonly userId?: number,
    readonly sentenceId?: number,
    readonly perfectVoiceCounts?: number,
    readonly userVoiceCounts?: number,
    readonly averageScore?: number,
    readonly highestScore?: number,
    readonly learningRate?: number,
    readonly latestLearningAt?: string,
    readonly isBookmark?: boolean,
    readonly bookmarkAt?: string
  ) {}
}

export interface UsersentenceHistoryPK extends UserSentenceHistory {
  readonly userId: number;
  readonly sentenceId: number;
}
