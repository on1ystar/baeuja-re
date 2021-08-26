export interface UserSentenceHistory {
  userId: number;
  sentenceId: number;
  counts?: number;
  perfectVoiceCounts?: number;
  userVoiceCounts?: number;
  averageScore?: number;
  highestScore?: number;
  learningRate?: number;
  latestLearningAt?: string;
  isBookmark?: boolean;
  bookmarkAt?: string;
}
