export interface UserUnitHistory {
  userId?: number;
  unitIndex?: number;
  contentId: number;
  counts?: number;
  latestLearningAt?: string;
}
