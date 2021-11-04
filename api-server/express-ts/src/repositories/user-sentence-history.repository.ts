/* eslint-disable no-console */
/**
 * @description user_sentence_evaluation 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import UserSentenceHistory, {
  UserSentenceHistoryPK
} from '../entities/user-sentence-history.entity';
import SentenceRepository from './sentence.repository';
import { UnitPK } from '../entities/unit.entity';
import { getSelectColumns } from '../utils/Query';

const DEFAULT_LEARNING_RATE = 0;

/**
 * @property userId: number
 * @property sentenceId: number
 */
export type UserSentenceHistoryToBeSaved = UserSentenceHistoryPK;

export default class UserSentenceHistoryRepository {
  // 사용자 문장 학습 기록 생성
  static save = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryToBeSaved
  ): Promise<void> => {
    try {
      await client.query(
        `INSERT INTO user_sentence_history(user_id, sentence_id, learning_rate) 
        VALUES($1, $2, $3)`,
        [
          userId,
          sentenceId,
          DEFAULT_LEARNING_RATE // learning_rate
        ]
      );

      console.info(
        `✅ inserted user_sentence_history table's row [${userId}, ${sentenceId}]`
      );
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts save function '
      );
      throw error;
    }
  };

  // id에 해당하는 문장 학습 기록 1개
  static findOne = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK,
    _columns: any[]
  ): Promise<UserSentenceHistory> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM user_sentence_history
        WHERE user_id = ${userId} AND sentence_id = ${sentenceId}`
      );
      if (!queryResult.rowCount)
        throw new Error('user sentence history does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts findOne function '
      );
      throw error;
    }
  };

  // 즐겨찾기 문장 리스트
  static joinSentence = async (
    client: PoolClient,
    userId: number,
    sortBy: string,
    option: string,
    _columns: any[],
    isBookmark?: boolean
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const andIsBookmark = isBookmark
        ? `AND user_sentence_history.is_bookmark = true`
        : '';

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} 
        FROM user_sentence_history
        JOIN sentence
        ON user_sentence_history.sentence_id = sentence.sentence_id
        WHERE user_sentence_history.user_id = ${userId} ${andIsBookmark}
        ORDER BY user_sentence_history.${sortBy} ${option}`
      );

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts joinSentence function '
      );
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  static updatePerfectVoiceCounts = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK
  ): Promise<number> => {
    try {
      const perfectVoiceCounts: number = (
        await client.query(
          `UPDATE user_sentence_history 
          SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = default
          WHERE user_id = $1 AND sentence_id = $2
          RETURNING perfect_voice_counts`,
          [userId, sentenceId]
        )
      ).rows[0].perfect_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's perfect_voice_counts"
      );
      return perfectVoiceCounts;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  static updateUserVoiceCounts = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK
  ): Promise<number> => {
    try {
      const userVoiceCounts: number = (
        await client.query(
          `UPDATE user_sentence_history 
          SET user_voice_counts = user_voice_counts + 1, latest_learning_at = default
          WHERE user_id = $1 AND sentence_id = $2
          RETURNING user_voice_counts`,
          [userId, sentenceId]
        )
      ).rows[0].user_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's user_voice_counts"
      );
      return userVoiceCounts;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts updateUserVoiceCounts function '
      );
      throw error;
    }
  };

  // 유닛에 포함된 문장들의 최근 학습 시간 갱신
  static updateLatestLearningAtByUnit = async (
    client: PoolClient,
    userId: number,
    { contentId, unitIndex }: UnitPK
  ): Promise<void> => {
    try {
      const sentenceIdList = await SentenceRepository.findAllByUnit(
        client,
        { contentId, unitIndex },
        ['sentenceId']
      );
      await client.query(
        `UPDATE user_sentence_history 
          SET latest_learning_at = default
          WHERE user_id = $1
            AND $2 <= sentence_id 
            AND sentence_id <= $3`,
        [
          userId,
          sentenceIdList[0].sentenceId,
          sentenceIdList[sentenceIdList.length - 1].sentenceId
        ]
      );
      console.info(
        "✅ updated user_sentence_history table's latest_learning_at"
      );
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts updateLatestLearningAtByUnit function '
      );
      throw error;
    }
  };

  // 즐갸칮기 추가/삭제
  static updateIsBookmark = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK
  ): Promise<boolean> => {
    try {
      const isBookmark: boolean = (
        await client.query(
          `UPDATE user_sentence_history
          SET is_bookmark = NOT is_bookmark, bookmark_at = default
          WHERE user_id = $1 AND sentence_id = $2
          RETURNING is_bookmark`,
          [userId, sentenceId]
        )
      ).rows[0].is_bookmark;

      console.info("✅ updated user_sentence_history table's is_bookmark");
      return isBookmark;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts updateIsBookmark function '
      );
      throw error;
    }
  };

  static updateScore = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK,
    averageScore: number,
    highestScore: number
  ): Promise<void> => {
    try {
      await client.query(
        `UPDATE user_sentence_history
          SET average_score = $3, highest_score = $4
          WHERE user_id = $1 AND sentence_id = $2`,
        [userId, sentenceId, averageScore, highestScore]
      );

      console.info(
        "✅ updated user_sentence_history table's average_score and highest_score"
      );
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts updateScore function '
      );
      throw error;
    }
  };

  // 사용자 문장 학습 기록 존재 여부
  static isExist = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryPK
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM user_sentence_history
        WHERE user_id = ${userId} AND sentence_id = ${sentenceId} `
      );

      // 존재하지 않음
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts isExist function '
      );
      throw error;
    }
  };

  // 사용자 문장 학습 기록 생성
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static createList = async (
    client: PoolClient,
    userId: number,
    sentencesId: any[]
  ) => {
    try {
      const valuesList = sentencesId
        .map(
          sentenceId => `(${userId}, ${sentenceId}, ${DEFAULT_LEARNING_RATE})`
        )
        .join(',');
      await client.query(
        `INSERT INTO user_sentence_history(user_id, sentence_id, learning_rate) 
      VALUES${valuesList}`
      );
      console.info("✅ inserted user_sentence_history table's rows");
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts createList function '
      );
      throw error;
    }
  };

  static getUserHistoryCounts = async (
    client: PoolClient,
    userId: number
  ): Promise<number> => {
    try {
      const countsOfSentences: number = (
        await client.query(
          `SELECT count(*) FROM user_sentence_history
        WHERE user_id = ${userId}`
        )
      ).rows[0].count;

      return countsOfSentences;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts getUserHistoryCounts function '
      );
      throw error;
    }
  };

  static getAverageOfAverageScore = async (
    client: PoolClient,
    userId: number
  ): Promise<number> => {
    try {
      const averageScoreOfSentences: number = (
        await client.query(
          `SELECT avg(average_score) FROM user_sentence_history
        WHERE user_id = ${userId}`
        )
      ).rows[0].avg;
      return averageScoreOfSentences;
    } catch (error) {
      console.warn(
        '❌ Error: user-sentence-history.repository.ts getAvarageOfAvarageScore function '
      );
      throw error;
    }
  };
}
