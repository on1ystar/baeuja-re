/* eslint-disable no-console */
/**
 * @description user_sentence_evaluation 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import format from 'pg-format';
import { getNowKO } from '../utils/Date';
import { UsersentenceHistoryPK } from '../entities/user-sentence-history.entity';
import SentenceRepository from './sentence.repository';
import { UnitPK } from '../entities/unit.entity';

const DEFAULT_LEARNING_RATE = 0;

/**
 * @property userId: number
 * @property sentenceId: number
 */
export type UserSentenceHistoryToBeSaved = UsersentenceHistoryPK;

export default class UserSentenceHistoryRepository {
  // 사용자 문장 학습 기록 생성
  static save = async (
    client: PoolClient,
    { userId, sentenceId }: UserSentenceHistoryToBeSaved
  ): Promise<void> => {
    try {
      await client.query(
        `INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) 
        VALUES($1, $2, $3, $4)`,
        [
          userId,
          sentenceId,
          getNowKO(), // latest_learning_at
          DEFAULT_LEARNING_RATE // learning_rate
        ]
      );

      console.info(
        `✅ inserted user_sentence_history table's row [${userId}, ${sentenceId}]`
      );
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.repository.ts save function '
      );
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  static updatePerfectVoiceCounts = async (
    client: PoolClient,
    { userId, sentenceId }: UsersentenceHistoryPK
  ): Promise<number> => {
    try {
      const perfectVoiceCounts: number = (
        await client.query(
          `UPDATE user_sentence_history 
          SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = $1
          WHERE user_id = $2 AND sentence_id = $3
          RETURNING perfect_voice_counts`,
          [
            getNowKO(), // latest_learning_at
            userId,
            sentenceId
          ]
        )
      ).rows[0].perfect_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's perfect_voice_counts"
      );
      return perfectVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.repository.ts updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static updateUserVoiceCounts = async (
    client: PoolClient,
    { userId, sentenceId }: UsersentenceHistoryPK
  ): Promise<number> => {
    try {
      const userVoiceCounts: number = (
        await client.query(
          `UPDATE user_sentence_history 
          SET user_voice_counts = user_voice_counts + 1, latest_learning_at = $1 
          WHERE user_id = $2 AND sentence_id = $3 
          RETURNING user_voice_counts`,
          [
            getNowKO(), // latest_learning_at
            userId,
            sentenceId
          ]
        )
      ).rows[0].user_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's user_voice_counts"
      );
      return userVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.repository.ts updateUserVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 문장 학습 기록 존재 여부
  static isExist = async (
    client: PoolClient,
    { userId, sentenceId }: UsersentenceHistoryPK
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
      console.error(
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

      await client.query(ARRAY_INSERT_SQL);
      console.info("✅ inserted user_sentence_history table's rows");
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.repository.ts createList function '
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
          SET latest_learning_at = $1
          WHERE user_id = $2 
            AND $3 <= sentence_id 
            AND sentence_id <= $4`,
        [
          getNowKO(),
          userId,
          sentenceIdList[0].sentenceId,
          sentenceIdList[sentenceIdList.length - 1].sentenceId
        ]
      );
      console.info(
        "✅ updated user_sentence_history table's latest_learning_at"
      );
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.repository.ts updateLatestLearningAtByUnit function '
      );
      throw error;
    }
  };
}
