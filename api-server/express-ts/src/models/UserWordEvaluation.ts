export class UserWordEvaluation {
  wordEvaluationCounts: number;
  userId: number;
  wordId: number;
  sttResult: string | undefined;
  score: number | undefined;
  userVoiceUri: string | undefined;
  createdAt: string | undefined;
  constructor(
    word_evaluation_counts: number,
    user_id: number,
    word_id: number,
    stt_result?: string,
    score?: number,
    user_voice_uri?: string,
    created_at?: string
  ) {
    this.wordEvaluationCounts = word_evaluation_counts;
    this.userId = user_id;
    this.wordId = word_id;
    this.sttResult = stt_result;
    this.score = score;
    this.userVoiceUri = user_voice_uri;
    this.createdAt = created_at;
  }
}
