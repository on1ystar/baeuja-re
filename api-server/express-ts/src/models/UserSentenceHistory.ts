export class UserSentenceHistory {
  userId: number;
  sentenceId: number;
  counts: number | undefined;
  perfectVoiceCounts: number | undefined;
  userVoiceCounts: number | undefined;
  averageScore: number | undefined;
  highestScore: number | undefined;
  learningRate: number | undefined;
  latestLearningAt: string | undefined;
  isBookmark: boolean | undefined;
  bookmarkAt: string | undefined;
  constructor(
    user_id: number,
    sentence_id: number,
    counts?: number,
    perfect_voice_counts?: number,
    user_voice_counts?: number,
    average_score?: number,
    highest_score?: number,
    learning_rate?: number,
    latest_learning_at?: string,
    is_bookmark?: boolean,
    bookmark_at?: string
  ) {
    this.userId = user_id;
    this.sentenceId = sentence_id;
    this.counts = counts;
    this.perfectVoiceCounts = perfect_voice_counts;
    this.userVoiceCounts = user_voice_counts;
    this.averageScore = average_score;
    this.highestScore = highest_score;
    this.learningRate = learning_rate;
    this.latestLearningAt = latest_learning_at;
    this.isBookmark = is_bookmark;
    this.bookmarkAt = bookmark_at;
  }
}
