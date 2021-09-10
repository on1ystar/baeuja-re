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
    readonly sttResult: string,
    readonly score: number,
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
              `SELECT count(*) 
              FROM user_sentence_evaluation 
              WHERE user_id = ${userId} AND sentence_id = ${sentenceId}`
            )
          ).rows[0].count
        ) + 1;
      console.info(
        `✅ userId: ${userId} sentenceId: ${sentenceId} sentenceEvaluationCounts: ${sentenceEvaluationCounts}`
      );
      return sentenceEvaluationCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-evaluation.entity.ts getSentenceEvaluationCounts function '
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
        `INSERT INTO user_sentence_evaluation
        VALUES(${this.userId},${this.sentenceId},${
          this.sentenceEvaluationCounts
        }, ${this.sttResult}, ${this.score}, ${
          this.userVoiceUri
        }, DEFAULT, ${getNowKO()})`
      );
      return {
        sentenceEvaluationCounts: this.sentenceEvaluationCounts,
        userId: this.userId,
        sentenceId: this.sentenceId,
        userVoiceUri: this.userVoiceUri
      };
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-evaluation.entity.ts insert function '
      );
      throw error;
    }
  };
}
