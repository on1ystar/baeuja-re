export class UserSentenceEvaluation {
  sentenceEvaluationCounts: number;
  userId: number;
  sentenceId: number;
  score: number | undefined;
  sttResult: string | undefined;
  userVoiceUri: string | undefined;
  isPublic: boolean | undefined;
  createdAt: string | undefined;
  constructor(
    sentence_evaluation_counts: number,
    user_id: number,
    sentence_id: number,
    score?: number,
    stt_result?: string,
    user_voice_uri?: string,
    is_public?: boolean,
    created_at?: string
  ) {
    this.sentenceEvaluationCounts = sentence_evaluation_counts;
    this.userId = user_id;
    this.sentenceId = sentence_id;
    this.score = score;
    this.sttResult = stt_result;
    this.userVoiceUri = user_voice_uri;
    this.isPublic = is_public;
    this.createdAt = created_at;
  }
}
