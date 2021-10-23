/**
  @description user_sentence_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/

export class UserSentenceHistoryPK {
  readonly userId?: number;

  readonly sentenceId?: number;
}

export default class UserSentenceHistory extends UserSentenceHistoryPK {
  constructor(
    readonly perfectVoiceCounts?: number,
    readonly userVoiceCounts?: number,
    readonly averageScore?: number,
    readonly highestScore?: number,
    readonly learningRate?: number,
    readonly isBookmark?: boolean,
    readonly latestLearningAt?: string,
    readonly bookmarkAt?: string
  ) {
    super();
  }
}
