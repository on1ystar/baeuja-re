/**
  @description user entity with repository
  @version PEAC-131-guest-login
*/
import { PoolClient, QueryResult } from 'pg';
import { getNowKO } from '../utils/Date';
import { getSelectColumns } from '../utils/Query';

export class User {
  constructor(
    readonly userId?: number,
    readonly email?: string,
    readonly nickname?: string,
    readonly locale?: string,
    readonly roleId?: number,
    readonly createdAt?: string,
    readonly latestLogin?: string,
    readonly modifiedAt?: string
  ) {}

  // 유저 생성
  create = async (client: PoolClient) => {
    if (
      this.email === undefined ||
      this.nickname === undefined ||
      this.locale === undefined ||
      this.roleId === undefined
    )
      throw new Error('email or nickname or locale or roleId is undefined');
    try {
      const createdUserId = (
        await client.query(
          `INSERT INTO users 
        VALUES(DEFAULT, '${this.email}', '${this.nickname}', '${
            this.locale
          }', ${getNowKO()}, ${getNowKO()}, ${getNowKO()}, ${this.roleId})
        RETURNING user_id`
        )
      ).rows[0].user_id;
      console.info(`✅ created user `);

      return { userId: createdUserId, email: this.email };
    } catch (error) {
      console.error('❌ Error: user.entity.ts create function ');
      throw error;
    }
  };

  // 닉네임 변경
  updateUserNickname = async (client: PoolClient, nickname: string) => {
    try {
      const updatedUser = (
        await client.query(
          `UPDATE users
          SET nickname = '${nickname}', modified_at = ${getNowKO()}
          WHERE user_id = ${this.userId}
          RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅  updated user's nickname -> ${nickname}`);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error: user.entity.ts updateUserNickname function ');
      throw error;
    }
  };

  // 최근 로그인 시간 갱신
  updateLatestLogin = async (client: PoolClient) => {
    try {
      const updatedUser = (
        await client.query(
          `UPDATE users
          SET latest_login = ${getNowKO()}
          WHERE user_id = ${this.userId}
          RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅  updated latest login at -> ${getNowKO()}`);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error: user.entity.ts updateLatestLogin function ');
      throw error;
    }
  };

  // 유저 삭제
  delete = async (client: PoolClient) => {
    try {
      if (this.userId === undefined) throw new Error('userId is undefined');
      const deletedUser = (
        await client.query(
          `DELETE FROM users
          WHERE user_id = ${this.userId}
          RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅ deleted user `);

      return deletedUser;
    } catch (error) {
      console.error('❌ Error: user.entity.ts delete function ');
      throw error;
    }
  };

  // 유저 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExistByEmail = async (client: PoolClient, email: string) => {
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

  // 유저 존재 여부 확인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExistById = async (client: PoolClient, userId: number) => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM users
        WHERE user_id = ${userId}`
      );

      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.error('❌ Error: user.entity.ts isExistById function ');
      throw error;
    }
  };

  // 유저 전체 조회
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static find = async (client: PoolClient, _columns: string[]) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users`
      );
      if (!queryResult.rowCount)
        throw new Error("User table's row does not exist");

      return queryResult.rows;
    } catch (error) {
      console.error('❌ Error: user.entity.ts find function ');
      throw error;
    }
  };

  // 유저 조회
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (
    client: PoolClient,
    userId: number,
    _columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users
       WHERE user_id = '${userId}'`
      );
      if (!queryResult.rowCount) throw new Error('user id does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: user.entity.ts findOne function ');
      throw error;
    }
  };

  // 유저 조회
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOneByEmail = async (
    client: PoolClient,
    email: string,
    _columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users
       WHERE email = '${email}'`
      );
      if (!queryResult.rowCount) throw new Error('email does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: user.entity.ts findOneByEmail function ');
      throw error;
    }
  };
}
