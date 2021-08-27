export interface UserContentHistory {
  userId: number;
  contentId: number;
  counts?: number;
  latestLearningAt?: string;
  learningTime?: string;
  progressRate?: number;
}
