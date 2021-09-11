/**
  @description user_content_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/
import { PoolClient, QueryResult } from 'pg';
import { getNowKO } from '../utils/Date';
import { Unit } from './unit.entity';

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
  create = async (client: PoolClient) => {
    try {
      await client.query(
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
  updateCounts = async (client: PoolClient) => {
    try {
      await client.query(
        `UPDATE user_content_history 
        SET counts = counts + 1, latest_learning_at = ${getNowKO()}
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

  // 콘텐츠 진도율(progress_rage) 업데이트
  updateProgressRate = async (client: PoolClient) => {
    try {
      // content에 포함되는 unit_index
      const userUnitHistoryRows = await Unit.leftJoinUserUnitHistory(
        client,
        this.userId,
        this.contentId,
        'UserUnitHistory.unitIndex'
      );
      // 학습 기록이 있는 유닛 개수 / 전체 유닛 개수 => 소수점 2자리까지 반올림
      const progressRate: number = +(
        userUnitHistoryRows.filter(row => row.unitIndex !== null).length /
        userUnitHistoryRows.length
      ).toFixed(2);
      await client.query(
        `UPDATE user_content_history 
        SET progress_rate = ${
          progressRate * 100
        }, latest_learning_at = ${getNowKO()}
        WHERE user_id = ${this.userId} AND content_id = ${this.contentId} `
      );
      console.info("✅ updated user_content_history table's progress_rate");
    } catch (error) {
      console.error(
        '❌ Error: user-content-history.entity.ts updateProgressRate function '
      );
      throw error;
    }
  };

  // 콘텐츠 학습 기록 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExist = async (
    client: PoolClient,
    userId: number,
    contentId: number
  ) => {
    try {
      const queryResult: QueryResult<any> = await client.query(
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
