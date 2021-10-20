/* eslint-disable no-console */
/**
 * @description user_sentence_evaluation 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient } from 'pg';
import UserSentenceEvaluation from '../entities/user-sentence-evaluation.entity';

export interface UserSentenceEvaluationToBeSaved
  extends UserSentenceEvaluation {
  readonly userId: number;
  readonly sentenceId: number;
  readonly sentenceEvaluationCounts: number;
  readonly sttResult: string;
  readonly score: number;
  readonly userVoiceUri: string;
}

export default class UserSentenceEvaluationRepository {
  static save = async (
    client: PoolClient,
    {
      userId,
      sentenceId,
      sentenceEvaluationCounts,
      sttResult,
      score,
      userVoiceUri
    }: UserSentenceEvaluationToBeSaved
  ): Promise<any> => {
    try {
      await client.query(
        `INSERT INTO user_sentence_evaluation
            VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [
          userId,
          sentenceId,
          sentenceEvaluationCounts,
          sttResult,
          Math.round(score),
          userVoiceUri,
          false // is_public (DEFAULT = false)
        ]
      );
      return {
        sentenceEvaluationCounts,
        userId,
        sentenceId,
        userVoiceUri
      };
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-evaluation.repository.ts save function '
      );
      throw error;
    }
  };

  static getSentenceEvaluationCounts = async (
    client: PoolClient,
    userId: number,
    sentenceId: number
  ): Promise<number> => {
    try {
      const sentenceEvaluationCounts =
        parseInt(
          (
            await client.query(
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
      console.warn(
        '❌ Error: user-sentence-evaluation.repository.ts getSentenceEvaluationCounts function '
      );
      throw error;
    }
  };
}
