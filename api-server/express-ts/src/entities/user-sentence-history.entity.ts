/**
  @description user_sentence_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import format from 'pg-format';
import { pool } from '../db';
import { getNowKO } from '../utils/Date';

const DEFAULT_LEARNING_RATE = 0;

export class UserSentenceHistory {
  constructor(
    readonly userId: number,
    readonly sentenceId: number,
    readonly perfectVoiceCounts?: number,
    readonly userVoiceCounts?: number,
    readonly averageScore?: number,
    readonly highestScore?: number,
    readonly learningRate?: number,
    readonly latestLearningAt?: string,
    readonly isBookmark?: boolean,
    readonly bookmarkAt?: string
  ) {}

  // 사용자 문장 학습 기록 생성
  static createList = async (userId: number, sentencesId: number[]) => {
    try {
      const ARRAY_INSERT_SQL = format(
        `INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) 
        VALUES %L`,
        sentencesId.map(sentenceId => [
          userId,
          sentenceId,
          getNowKO(),
          DEFAULT_LEARNING_RATE
        ])
      );

      await pool.query(ARRAY_INSERT_SQL);
      console.info("✅ inserted user_sentence_history table's rows");
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts createList function '
      );
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  updatePerfectVoiceCounts = async () => {
    try {
      const perfectVoiceCounts = (
        await pool.query(
          `UPDATE user_sentence_history 
          SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = ${getNowKO()} 
          WHERE user_id = ${this.userId} AND sentence_id = ${this.sentenceId} 
          RETURNING perfect_voice_counts`
        )
      ).rows[0].perfect_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's perfect_voice_counts"
      );
      return perfectVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  updateUserVoiceCounts = async () => {
    try {
      const userVoiceCounts = (
        await pool.query(
          `UPDATE user_sentence_history 
          SET user_voice_counts = user_voice_counts + 1, latest_learning_at = ${getNowKO()} 
          WHERE user_id = ${this.userId} AND sentence_id = ${
            this.sentenceId
          } RETURNING user_voice_counts`
        )
      ).rows[0].user_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's user_voice_counts"
      );
      return userVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts updateUserVoiceCounts function '
      );
      throw error;
    }
  };
}
