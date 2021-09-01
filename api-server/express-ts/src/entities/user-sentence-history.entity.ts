/**
  @description user_sentence_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import format from 'pg-format';
import { pool } from '../db';
import { getNowKO } from '../utils/Date';

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
        'INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES %L',
        sentencesId.map(sentenceId => [userId, sentenceId, getNowKO(), 0])
      );

      await pool.query(ARRAY_INSERT_SQL);
      console.log("inserted user_sentence_history table's rows");
    } catch (error) {
      console.log('Error: UserSentenceHistory createList function ');
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  updatePerfectVoiceCounts = async () => {
    try {
      const perfectVoiceCounts = (
        await pool.query(
          'UPDATE user_sentence_history SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = $1 WHERE user_id = $2 AND sentence_id = $3 RETURNING perfect_voice_counts',
          [getNowKO(), this.userId, this.sentenceId]
        )
      ).rows[0].perfect_voice_counts;
      console.log("updated user_sentence_history table's perfect_voice_counts");
      return perfectVoiceCounts;
    } catch (error) {
      console.log(
        'Error: UserSentenceHistory updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  updateUserVoiceCounts = async () => {
    try {
      const userVoiceCounts = (
        await pool.query(
          'UPDATE user_sentence_history SET user_voice_counts = user_voice_counts + 1, latest_learning_at = $1 WHERE user_id = $2 AND sentence_id = $3 RETURNING user_voice_counts',
          [getNowKO(), this.userId, this.sentenceId]
        )
      ).rows[0].user_voice_counts;
      console.log("updated user_sentence_history table's user_voice_counts");
      return userVoiceCounts;
    } catch (error) {
      console.log('Error: UserSentenceHistory updateUserVoiceCounts function ');
      throw error;
    }
  };
}
