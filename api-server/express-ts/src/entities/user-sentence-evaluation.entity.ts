/**
  @description user_sentence_evaluation entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import { pool } from '../db';
import { getNowKO } from '../utils/Date';

export default class UserSentenceEvaluation {
  constructor(
    readonly userId: number,
    readonly sentenceId: number,
    readonly score: number,
    readonly sttResult: string,
    readonly userVoiceUri: string,
    readonly isPublic?: boolean,
    readonly createdAt?: string,
    public sentenceEvaluationCounts?: number
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getSentenceEvaluationCounts = async (
    userId: number,
    sentenceId: number
  ) => {
    try {
      const sentenceEvaluationCounts =
        parseInt(
          (
            await pool.query(
              'SELECT count(*) FROM user_sentence_evaluation WHERE user_id = $1 AND sentence_id = $2',
              [userId, sentenceId]
            )
          ).rows[0].count
        ) + 1;
      console.log(
        `userId: ${userId} sentenceId: ${sentenceId} sentenceEvaluationCounts: ${sentenceEvaluationCounts}`
      );
      return sentenceEvaluationCounts;
    } catch (error) {
      console.error(
        'Error: UserSentenceEvaluation getSentenceEvaluationCounts function '
      );
      throw error;
    }
  };

  create = async () => {
    try {
      this.sentenceEvaluationCounts =
        await UserSentenceEvaluation.getSentenceEvaluationCounts(
          this.userId,
          this.sentenceId
        );
      await pool.query(
        'INSERT INTO user_sentence_evaluation(sentence_evaluation_counts, user_id, sentence_id, score, stt_result, user_voice_uri, is_public, created_at)\
    VALUES($1,$2,$3,$4,$5,$6, DEFAULT, $7)',
        [
          this.sentenceEvaluationCounts,
          this.userId,
          this.sentenceId,
          this.score,
          this.sttResult,
          this.userVoiceUri,
          getNowKO()
        ]
      );
      return {
        sentenceEvaluationCounts: this.sentenceEvaluationCounts,
        userId: this.userId,
        sentenceId: this.sentenceId,
        userVoiceUri: this.userVoiceUri
      };
    } catch (error) {
      console.error('Error: UserSentenceEvaluation insert function ');
      throw error;
    }
  };
}
