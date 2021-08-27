export interface UserSentenceEvaluation {
  sentenceEvaluationCounts: number;
  userId: number;
  sentenceId: number;
  score?: number;
  sttResult?: string;
  userVoiceUri?: string;
  isPublic?: boolean;
  createdAt?: string;
}
