/* eslint-disable no-console */
/**
 * @description user_content_history 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import { getNowKO } from '../utils/Date';
import { UserContentHistoryPK } from '../entities/user-content-history.entity';
import UnitRepository from '../repositories/unit.repository';

export type UserContentHistoryToBeSaved = UserContentHistoryPK;

export default class UserContentHistoryRepository {
  // 콘텐츠 학습 기록 추가
  static save = async (
    client: PoolClient,
    { userId, contentId }: UserContentHistoryToBeSaved
  ): Promise<void> => {
    try {
      await client.query(
        `INSERT INTO user_content_history
        VALUES($1, $2, $3, $4, $5, $6)`,
        [
          userId, // userId
          contentId, // contentId
          1, // counts (DEFAULT = 1)
          getNowKO(), // leatestLearningAt
          '00:00:00', // learningTime (DEFAULT = 00:00:00)
          0 // progressRate (DEFAULT = 0)
        ]
      );
      console.info("✅ inserted user_content_history table's row");
    } catch (error) {
      console.warn(
        '❌ Error: user-content-history.repository.ts save function '
      );
      throw error;
    }
  };

  // 콘텐츠 학습 횟수 1 증가
  static updateCounts = async (
    client: PoolClient,
    { userId, contentId }: UserContentHistoryPK
  ): Promise<void> => {
    try {
      await client.query(
        `UPDATE user_content_history
        SET counts = counts + 1, latest_learning_at = $1
        WHERE user_id = $2 AND content_id = $3 `,
        [
          getNowKO(), // leatestLearningAt
          userId, // userId
          contentId // contentId
        ]
      );
      console.info("✅ updated user_content_history table's counts ++ ");
    } catch (error) {
      console.warn(
        '❌ Error: user-content-history.repository.ts updateCounts function '
      );
      throw error;
    }
  };

  // 콘텐츠 진도율(progress_rage) 업데이트
  static updateProgressRate = async (
    client: PoolClient,
    { userId, contentId }: UserContentHistoryPK
  ): Promise<void> => {
    try {
      // content에 포함되는 unit_index
      const userUnitHistoryRows = await UnitRepository.leftJoinUserUnitHistory(
        client,
        userId as number,
        contentId as number,
        [{ UserUnitHistory: ['unitIndex'] }]
      );
      // 학습 기록이 있는 유닛 개수 / 전체 유닛 개수 => 소수점 2자리까지 반올림
      const progressRate: number = +(
        userUnitHistoryRows.filter(row => row.unitIndex !== null).length /
        userUnitHistoryRows.length
      ).toFixed(2);
      await client.query(
        `UPDATE user_content_history
        SET progress_rate = $1, latest_learning_at = $2
        WHERE user_id = $3 AND content_id = $4`,
        [Math.round(progressRate * 100), getNowKO(), userId, contentId]
      );
      console.info("✅ updated user_content_history table's progress_rate");
    } catch (error) {
      console.warn(
        '❌ Error: user-content-history.repository.ts updateProgressRate function '
      );
      throw error;
    }
  };

  // 콘텐츠 학습 기록 존재 여부 확인
  static isExist = async (
    client: PoolClient,
    { userId, contentId }: UserContentHistoryPK
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM user_content_history
        WHERE user_id = ${userId} AND content_id = ${contentId} `
      );

      // 존재하지 않음
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn(
        '❌ Error: user-content-history.repository.ts isExist function '
      );
      throw error;
    }
  };
}
