export class UserLearningUnitHistory {
  userId: number;
  learningUnitId: number;
  contentsId: number;
  counts: number | undefined;
  latestLearningAt: string | undefined;
  learningTime: string | undefined;
  constructor(
    user_id: number,
    learning_unit_id: number,
    contents_id: number,
    counts?: number,
    latest_learning_at?: string,
    learning_time?: string
  ) {
    this.userId = user_id;
    this.learningUnitId = learning_unit_id;
    this.contentsId = contents_id;
    this.counts = counts;
    this.latestLearningAt = latest_learning_at;
    this.learningTime = learning_time;
  }
}
