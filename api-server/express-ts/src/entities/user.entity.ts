/**
  @description user entity with repository
  @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
*/
import { PoolClient, QueryResult } from 'pg';
import { getNowKO } from '../utils/Date';
import { getSelectColumns } from '../utils/Query';

export class User {
  constructor(
    readonly email: string,
    readonly nickname: string,
    readonly locale: string,
    readonly isAdmin?: boolean,
    readonly createdAt?: string,
    readonly latestLogin?: string,
    readonly modifiedAt?: string,
    readonly deviceOs?: string,
    readonly usageTime?: string,
    readonly userId?: number
  ) {}

  // `INSERT INTO user_sentence_evaluation
  //       VALUES(${this.userId},${this.sentenceId},${
  //         this.sentenceEvaluationCounts
  //       }, '${this.sttResult}', ${this.score}, '${
  //         this.userVoiceUri

  // 유저 생성
  create = async (client: PoolClient) => {
    try {
      const createdUserId: QueryResult<any> = await client.query(
        `INSERT INTO users 
        VALUES(DEFAULT, ${this.email}, ${this.nickname}, ${this.locale}, DEFAULT, ${getNowKO}, ${getNowKO},${getNowKO})
        RETURNING user_id`
      );
      console.info(`✅ created user `);

      return { userId: createdUserId, email: this.email };
    } catch (error) {
      console.error('❌ Error: user.entity.ts create function ');
      throw error;
    }
  };

  // 유저 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExist = async (client: PoolClient, email: string) => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM users
        WHERE email = '${email}'`
      );

      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.error('❌ Error: user.entity.ts isExist function ');
      throw error;
    }
  };

  // 유저 조회
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOneByEmail = async (
    client: PoolClient,
    email: string,
    ..._columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users \
       WHERE email = ${email}`
      );
      if (!queryResult.rowCount) throw new Error('email does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: user.entity.ts findOneByEmail function ');
      throw error;
    }
  };
}
