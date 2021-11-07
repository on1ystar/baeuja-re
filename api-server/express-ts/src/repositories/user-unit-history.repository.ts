/* eslint-disable no-console */
/**
 * @description user_unit_history 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import {
  UserUnitHistory,
  UserUnitHistoryPK
} from '../entities/user-unit-history.entity.';
import { getSelectColumns } from '../utils/Query';

type UserUnitHistoryToBeSaved = UserUnitHistoryPK;

export default class UserUnitHistoryRepository {
  // 유닛 학습 기록
  static save = async (
    client: PoolClient,
    { userId, contentId, unitIndex }: UserUnitHistoryToBeSaved
  ): Promise<void> => {
    try {
      await client.query(
        `INSERT INTO user_unit_history(user_id, content_id, unit_index, counts)
        VALUES($1, $2, $3, $4)`,
        [
          userId, // user_id
          contentId, // content_id
          unitIndex, // unit_index
          1 // counts (DEFAULT = 1)
        ]
      );
      console.info("✅ inserted user_unit_history table's row");
    } catch (error) {
      console.warn('❌ Error: user-unit-history.repository.ts save function ');
      throw error;
    }
  };

  // 유닛 학습 횟수 1 증가
  static updateCounts = async (
    client: PoolClient,
    { userId, contentId, unitIndex }: UserUnitHistoryPK
  ): Promise<void> => {
    try {
      await client.query(
        `UPDATE user_unit_history 
        SET counts = counts + 1, latest_learning_at = default
        WHERE user_id = $1 AND content_id = $2 AND unit_index = $3`,
        [
          userId, // user_id
          contentId, // content_id
          unitIndex // unit_index
        ]
      );
      console.info("✅ updated user_unit_history table's counts ++ ");
    } catch (error) {
      console.warn(
        '❌ Error: user-unit-history.repository.ts updateCounts function '
      );
      throw error;
    }
  };

  // 유닛을 이전에 학습 했는 지 체크
  static findOne = async (
    client: PoolClient,
    { userId, contentId, unitIndex }: UserUnitHistoryPK,
    _columns: any[]
  ): Promise<UserUnitHistory> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM user_unit_history
        WHERE user_id = ${userId} AND content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.warn(
        '❌ Error: user-unit-history.repository.ts findOne function '
      );
      throw error;
    }
  };

  // 특정 content에 포함된 유닛 헉숩 기록 반환
  static findAllByContent = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    _columns: any[]
  ): Promise<UserUnitHistory[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM user_unit_history
        WHERE user_id = ${userId} AND content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: user-unit-history.repository.ts findAllByContent function '
      );
      throw error;
    }
  };

  // 유닛 학습 기록 존재 여부 확인
  static isExist = async (
    client: PoolClient,
    { userId, contentId, unitIndex }: UserUnitHistoryPK
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM user_unit_history
        WHERE user_id = ${userId} 
          AND content_id = ${contentId} 
          AND unit_index = ${unitIndex}`
      );

      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn(
        '❌ Error: user-unit-history.repository.ts isExist function '
      );
      throw error;
    }
  };

  static getUserHistoryCounts = async (
    client: PoolClient,
    userId: number
  ): Promise<number> => {
    try {
      const countsOfUnits: number = (
        await client.query(
          `SELECT count(*) FROM user_unit_history
        WHERE user_id = ${userId}`
        )
      ).rows[0].count;

      return countsOfUnits;
    } catch (error) {
      console.warn(
        '❌ Error: user_unit_history.repository.ts getUserHistoryCounts function '
      );
      throw error;
    }
  };
}
