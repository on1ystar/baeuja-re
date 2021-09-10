/**
  @description user_content_history entity with repository
  @version feature/api/PEAC-38-learning-list-api
*/
import { QueryResult } from 'pg';
import { pool } from '../db';
import { getNowKO } from '../utils/Date';

export class UserContentHistory {
  constructor(
    readonly userId: number,
    readonly contentId: number,
    readonly counts?: number,
    readonly latestLearningAt?: string,
    readonly learningTime?: string,
    readonly progressRate?: number
  ) {}

  // 콘텐츠 학습 기록 추가
  create = async () => {
    try {
      await pool.query(
        `INSERT INTO user_content_history 
        VALUES(${this.userId},  ${
          this.contentId
        }, DEFAULT, ${getNowKO()}, DEFAULT, DEFAULT)`
      );
      console.info("✅ inserted user_content_history table's row");
    } catch (error) {
      console.error(
        '❌ Error: user-content-history.entity.ts create function '
      );
      throw error;
    }
  };

  // 콘텐츠 학습 횟수 1 증가
  updateCounts = async () => {
    try {
      await pool.query(
        `UPDATE user_content_history SET counts = counts + 1, latest_learning_at = ${getNowKO()}
        WHERE user_id = ${this.userId} AND content_id = ${this.contentId} `
      );
      console.info("✅ updated user_content_history table's counts ++ ");
    } catch (error) {
      console.error(
        '❌ Error: user-content-history.entity.ts updateCounts function '
      );
      throw error;
    }
  };

  // 콘텐츠 학습 기록 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExist = async (userId: number, contentId: number) => {
    try {
      const queryResult: QueryResult<any> = await pool.query(
        `SELECT COUNT(*) FROM user_content_history
        WHERE user_id = ${userId} AND content_id = ${contentId} `
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      // 존재하지 않음
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.error(
        '❌ Error: user-content-history.entity.ts isExist function '
      );
      throw error;
    }
  };
}
