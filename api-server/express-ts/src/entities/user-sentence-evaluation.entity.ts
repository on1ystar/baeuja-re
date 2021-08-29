/**
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/
import { pool } from '../db';

export default class UserSentenceEvaluation {
  constructor(
    readonly userId: number,
    readonly sentenceId: number,
    readonly score: number,
    readonly sttResult: string,
    readonly userVoiceUri: string,
    readonly isPublic: boolean,
    readonly createdAt: string,
    public sentenceEvaluationCounts?: number
  ) {}

  getSentenceEvaluationCounts() {
    return this.sentenceEvaluationCounts;
  }

  insert = async () => {
    try {
      this.sentenceEvaluationCounts =
        parseInt(
          (
            await pool.query(
              'SELECT count(*) FROM user_sentence_evaluation WHERE user_id = $1 AND sentence_id = $2',
              [this.userId, this.sentenceId]
            )
          ).rows[0].count
        ) + 1;
      await pool.query(
        'INSERT INTO user_sentence_evaluation(sentence_evaluation_counts, user_id, sentence_id, score, stt_result, user_voice_uri, is_public, created_at)\
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
        [
          this.sentenceEvaluationCounts,
          this.userId,
          this.sentenceId,
          this.score,
          this.sttResult,
          this.userVoiceUri,
          this.isPublic,
          this.createdAt
        ]
      );
      return {
        sentenceEvaluationCounts: this.sentenceEvaluationCounts,
        userId: this.userId,
        sentenceId: this.sentenceId,
        score: this.score,
        sttResult: this.sttResult,
        userVoiceUri: this.userVoiceUri
      };
    } catch (error) {
      console.error('Error: UserSentenceEvaluation insert function ');
      throw error;
    }
  };
}
