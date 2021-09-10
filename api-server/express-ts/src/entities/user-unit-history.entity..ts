/**
  @description user_unit_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import { QueryResult } from 'pg';
import { pool } from '../db';
import { getNowKO } from '../utils/Date';

export class UserUnitHistory {
  constructor(
    readonly userId: number,
    readonly unitIndex: number,
    readonly contentId: number,
    readonly counts?: number,
    readonly latestLearningAt?: string
  ) {}

  // 유닛을 이전에 학습 했는 지 체크
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (
    userId: number,
    unitIndex: number,
    contentId: number
  ) => {
    try {
      const queryResult: QueryResult<any> = await pool.query(
        `SELECT counts FROM user_unit_history
        WHERE user_id = ${userId} AND content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount) return false;
      return queryResult.rows[0].counts;
    } catch (error) {
      console.error('❌ Error: user-unit-history.entity.ts findOne function ');
      throw error;
    }
  };

  // 유닛 학습 기록
  create = async () => {
    try {
      await pool.query(
        `INSERT INTO user_unit_history 
        VALUES(${this.userId},  ${this.contentId}, ${
          this.unitIndex
        }, DEFAULT, ${getNowKO()})`
      );
      console.info("✅ inserted user_unit_history table's row");
    } catch (error) {
      console.error('❌ Error: user-unit-history.entity.ts insert function ');
      throw error;
    }
  };

  // 유닛 학습 횟수 1 증가
  updateCounts = async () => {
    try {
      await pool.query(
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
}
