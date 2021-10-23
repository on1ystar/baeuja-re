export class UserWordHistoryPK {
  readonly userId?: number;

  readonly wordId?: number;
}

export default class UserWordHistory extends UserWordHistoryPK {
  constructor(
    readonly counts?: number,
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
