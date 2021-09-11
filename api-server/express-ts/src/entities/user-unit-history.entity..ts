/**
  @description user_unit_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import { PoolClient, QueryResult } from 'pg';
import { getNowKO } from '../utils/Date';
import { getSelectColumns } from '../utils/Query';

export class UserUnitHistory {
  constructor(
    readonly userId: number,
    readonly contentId: number,
    readonly unitIndex: number,
    readonly counts?: number,
    readonly latestLearningAt?: string
  ) {}

  // 유닛을 이전에 학습 했는 지 체크
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    unitIndex: number,
    ..._columns: string[]
  ) => {
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
      console.error('❌ Error: user-unit-history.entity.ts findOne function ');
      throw error;
    }
  };

  // 특정 content에 포함된 유닛 헉숩 기록 반환
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findByContent = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    ..._columns: string[]
  ) => {
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
      console.error(
        '❌ Error: user-unit-history.entity.ts findByContent function '
      );
      throw error;
    }
  };

  // 유닛 학습 기록
  create = async (client: PoolClient) => {
    try {
      await client.query(
        `INSERT INTO user_unit_history 
        VALUES(${this.userId},  ${this.contentId}, ${
          this.unitIndex
        }, DEFAULT, ${getNowKO()})`
      );
      console.info("✅ inserted user_unit_history table's row");
    } catch (error) {
      console.error('❌ Error: user-unit-history.entity.ts create function ');
      throw error;
    }
  };

  // 유닛 학습 횟수 1 증가
  updateCounts = async (client: PoolClient) => {
    try {
      await client.query(
        `UPDATE user_unit_history SET counts = counts + 1, latest_learning_at = ${getNowKO()}
        WHERE user_id = ${this.userId} AND content_id = ${
          this.contentId
        } AND unit_index = ${this.unitIndex}`
      );
      console.info("✅ updated user_unit_history table's counts ++ ");
    } catch (error) {
      console.error(
        '❌ Error: user-unit-history.entity.ts updateCounts function '
      );
      throw error;
    }
  };

  // 유닛 학습 기록 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExist = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    unitIndex: number
  ) => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM user_unit_history
        WHERE user_id = ${userId} AND content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.error('❌ Error: user-unit-history.entity.ts isExist function ');
      throw error;
    }
  };
}
