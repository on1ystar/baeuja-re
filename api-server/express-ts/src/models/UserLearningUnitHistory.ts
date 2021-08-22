export class UserLearningUnitHistory {
  user_id: number;
  learning_unit_id: number;
  contents_id: number;
  counts: number | undefined;
  latest_learning_at: string | undefined;
  learning_time: string | undefined;
  constructor(
    user_id: number,
    learning_unit_id: number,
    contents_id: number,
    counts?: number,
    latest_learning_at?: string,
    learning_time?: string
  ) {
    user_id;
    learning_unit_id;
    contents_id;
    counts;
    latest_learning_at;
    learning_time;
  }
}
