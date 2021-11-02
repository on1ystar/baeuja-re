/* eslint-disable no-console */
/**
 * @description user_word_evaluation 테이블 SQL
 * @version feature/api/PEAC-202-words-api
 */

import { PoolClient } from 'pg';
import UserWordEvaluation from '../entities/user-word-evaluation.entity';

export interface UserWordEvaluationToBeSaved extends UserWordEvaluation {
  readonly userId: number;
  readonly wordId: number;
  readonly wordEvaluationCounts: number;
  readonly sttResult: string;
  readonly score: number;
  readonly userVoiceUri: string;
}

export default class UserWordEvaluationRepository {
  static save = async (
    client: PoolClient,
    {
      userId,
      wordId,
      wordEvaluationCounts,
      sttResult,
      score,
      userVoiceUri
    }: UserWordEvaluationToBeSaved
  ): Promise<any> => {
    try {
      await client.query(
        `INSERT INTO user_word_evaluation(user_id, word_id, word_evaluation_counts, stt_result, score, user_voice_uri)
             VALUES($1,$2,$3,$4,$5,$6)`,
        [
          userId,
          wordId,
          wordEvaluationCounts,
          sttResult,
          Math.round(score),
          userVoiceUri
        ]
      );
      return {
        wordEvaluationCounts,
        userId,
        wordId,
        userVoiceUri
      };
    } catch (error) {
      console.warn(
        '❌ Error: user-word-evaluation.repository.ts save function '
      );
      throw error;
    }
  };

  static getWordEvaluationCounts = async (
    client: PoolClient,
    userId: number,
    wordId: number
  ): Promise<number> => {
    try {
      const wordEvaluationCounts =
        parseInt(
          (
            await client.query(
              `SELECT count(*) 
               FROM user_word_evaluation 
               WHERE user_id = ${userId} AND word_id = ${wordId}`
            )
          ).rows[0].count
        ) + 1;
      console.info(
        `✅ userId: ${userId} wordId: ${wordId} wordEvaluationCounts: ${wordEvaluationCounts}`
      );
      return wordEvaluationCounts;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-evaluation.repository.ts getWordEvaluationCounts function '
      );
      throw error;
    }
  };

  static getAvarageScore = async (
    client: PoolClient,
    userId: number
  ): Promise<number> => {
    try {
      const avarageScoreOfWords: number = (
        await client.query(
          `SELECT avg(score) FROM user_word_evaluation
        WHERE user_id = ${userId}`
        )
      ).rows[0].avg;
      return avarageScoreOfWords;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-evaluation.repository.ts getAvarageScore function '
      );
      throw error;
    }
  };
}
