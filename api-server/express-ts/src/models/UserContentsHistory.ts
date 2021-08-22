export class UserContentsHistory {
  userId: number;
  contentsId: number;
  counts: number | undefined;
  latestLearningAt: string | undefined;
  learningTime: string | undefined;
  progressRate: number | undefined;
  constructor(
    user_id: number,
    contents_id: number,
    counts?: number,
    latest_learning_at?: string,
    learning_time?: string,
    progress_rate?: number
  ) {
    this.userId = user_id;
    this.contentsId = contents_id;
    this.counts = counts;
    this.latestLearningAt = latest_learning_at;
    this.learningTime = learning_time;
    this.progressRate = progress_rate;
  }
}
