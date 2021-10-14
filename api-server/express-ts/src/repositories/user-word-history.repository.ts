import { PoolClient, QueryResult } from 'pg';
import { UserWordHistoryPK } from '../entities/user-word-history.entity';
import { getNowKO } from '../utils/Date';

const DEFAULT_LEARNING_RATE = 0;

export type UserWordHistoryToBeSaved = UserWordHistoryPK;

export default class UserWordHistoryRepository {
  // 사용자 단어 학습 기록 생성
  static save = async (
    client: PoolClient,
    { userId, wordId }: UserWordHistoryToBeSaved
  ): Promise<void> => {
    try {
      await client.query(
        `INSERT INTO user_word_history(user_id, word_id, latest_learning_at, learning_rate) 
        VALUES($1, $2, $3, $4)`,
        [
          userId,
          wordId,
          getNowKO(), // latest_learning_at
          DEFAULT_LEARNING_RATE // learning_rate
        ]
      );

      console.info(
        `✅ inserted user_word_history table's row [${userId}, ${wordId}]`
      );
    } catch (error) {
      console.warn('❌ Error: user-word-history.repository.ts save function ');
      throw error;
    }
  };

  // 단어 학습 횟수 1 증가
  static updateCounts = async (
    client: PoolClient,
    { userId, wordId }: UserWordHistoryPK
  ): Promise<number> => {
    try {
      const counts: number = (
        await client.query(
          `UPDATE user_word_history 
          SET counts = counts + 1, latest_learning_at = $1
          WHERE user_id = $2 AND word_id = $3
          RETURNING counts`,
          [
            getNowKO(), // latest_learning_at
            userId,
            wordId
          ]
        )
      ).rows[0].perfect_voice_counts;
      console.info("✅ updated user_word_history table's counts++");
      return counts;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-history.repository.ts updateCounts function '
      );
      throw error;
    }
  };

  // 존재 여부
  static isExist = async (
    client: PoolClient,
    { userId, wordId }: UserWordHistoryPK
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT count(*) FROM user_word_history
        WHERE user_id = ${userId} AND word_id = ${wordId}`
      );

      // 존재하지 않음
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-history.repository.ts isExist function '
      );
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  static updatePerfectVoiceCounts = async (
    client: PoolClient,
    { userId, wordId }: UserWordHistoryPK
  ): Promise<number> => {
    try {
      const perfectVoiceCounts: number = (
        await client.query(
          `UPDATE user_word_history 
          SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = $1
          WHERE user_id = $2 AND word_id = $3
          RETURNING perfect_voice_counts`,
          [
            getNowKO(), // latest_learning_at
            userId,
            wordId
          ]
        )
      ).rows[0].perfect_voice_counts;
      console.info("✅ updated user_word_history table's perfect_voice_counts");
      return perfectVoiceCounts;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-history.repository.ts updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static updateUserVoiceCounts = async (
    client: PoolClient,
    { userId, wordId }: UserWordHistoryPK
  ): Promise<number> => {
    try {
      const userVoiceCounts: number = (
        await client.query(
          `UPDATE user_word_history 
          SET user_voice_counts = user_voice_counts + 1, latest_learning_at = $1 
          WHERE user_id = $2 AND word_id = $3 
          RETURNING user_voice_counts`,
          [
            getNowKO(), // latest_learning_at
            userId,
            wordId
          ]
        )
      ).rows[0].user_voice_counts;
      console.info("✅ updated user_word_history table's user_voice_counts");
      return userVoiceCounts;
    } catch (error) {
      console.warn(
        '❌ Error: user-word-history.repository.ts updateUserVoiceCounts function '
      );
      throw error;
    }
  };
}
