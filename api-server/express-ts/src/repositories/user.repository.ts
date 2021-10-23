/* eslint-disable no-console */
/**
 * @description user 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import User from '../entities/user.entity';
import { getSelectColumns } from '../utils/Query';

export interface UserToBeSaved extends User {
  readonly email: string;
  readonly nickname: string;
  readonly platform: string;
  readonly country: string;
  readonly timezone: string;
  readonly roleId: number;
}

export default class UserRepository {
  // 유저 생성
  static save = async (
    client: PoolClient,
    { email, nickname, platform, country, timezone, roleId }: UserToBeSaved
  ): Promise<User> => {
    if (
      email === undefined ||
      nickname === undefined ||
      country === undefined ||
      platform === undefined ||
      timezone === undefined ||
      roleId === undefined
    )
      throw new Error(
        'email || nickname || country || platform || timezone || roleId is undefined'
      );
    try {
      const createdUserId: number = (
        await client.query(
          `INSERT INTO users(email, nickname, platform, country, timezone, role_id)
          VALUES($1, $2, $3, $4, $5, $6)
          RETURNING user_id`,
          [email, nickname, platform, country, timezone, roleId]
        )
      ).rows[0].user_id;
      console.info(`✅ created user `);

      return { userId: createdUserId, email: email };
    } catch (error) {
      console.warn('❌ Error: user.repository.ts save function ');
      throw error;
    }
  };

  // 닉네임 변경
  static updateUserNickname = async (
    client: PoolClient,
    userId: number,
    nicknameToUpdate: string
  ): Promise<User> => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { user_id, email, nickname } = (
        await client.query(
          `UPDATE users
            SET nickname = '${nicknameToUpdate}', modified_at = default
            WHERE user_id = ${userId}
            RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅  updated user's nickname -> ${nicknameToUpdate}`);
      return { userId: user_id, email, nickname };
    } catch (error) {
      console.warn('❌ Error: user.repository.ts updateUserNickname function ');
      throw error;
    }
  };

  // 최근 로그인 시간 갱신
  static updateLatestLogin = async (
    client: PoolClient,
    userId: number
  ): Promise<User> => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { user_id, email, nickname } = (
        await client.query(
          `UPDATE users
            SET latest_login = default
            WHERE user_id = ${userId}
            RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅ updated userId: ${user_id} latest login at`);
      return { userId: user_id, email, nickname };
    } catch (error) {
      console.warn('❌ Error: user.repository.ts updateLatestLogin function ');
      throw error;
    }
  };

  // 유저 삭제
  static delete = async (client: PoolClient, userId: number): Promise<User> => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { user_id, email, nickname } = (
        await client.query(
          `DELETE FROM users
            WHERE user_id = ${userId}
            RETURNING user_id, email, nickname`
        )
      ).rows[0];
      console.info(`✅ deleted user `);
      return { userId: user_id, email, nickname };
    } catch (error) {
      console.warn('❌ Error: user.repository.ts delete function ');
      throw error;
    }
  };

  // 유저 존재 여부 확인
  static isExistByEmail = async (
    client: PoolClient,
    email: string
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM users
          WHERE email = '${email}'`
      );
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn('❌ Error: user.repository.ts isExist function ');
      throw error;
    }
  };

  // 유저 존재 여부 확인
  static isExistById = async (
    client: PoolClient,
    userId: number
  ): Promise<boolean> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM users
          WHERE user_id = ${userId}`
      );

      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.warn('❌ Error: user.repository.ts isExistById function ');
      throw error;
    }
  };

  // 유저 전체 조회
  static findAll = async (
    client: PoolClient,
    _columns: any[]
  ): Promise<User[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users`
      );
      if (!queryResult.rowCount)
        throw new Error("User table's row does not exist");
      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: user.repository.ts find function ');
      throw error;
    }
  };

  // 유저 조회
  static findOne = async (
    client: PoolClient,
    userId: number,
    _columns: any[]
  ): Promise<User> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');
      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users
         WHERE user_id = '${userId}'`
      );
      if (!queryResult.rowCount) throw new Error('user id does not exist');
      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: user.repository.ts findOne function ');
      throw error;
    }
  };

  // 유저 조회
  static findOneByEmail = async (
    client: PoolClient,
    email: string,
    _columns: any[]
  ): Promise<User> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM users
         WHERE email = '${email}'`
      );
      if (!queryResult.rowCount) throw new Error('email does not exist');
      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: user.repository.ts findOneByEmail function ');
      throw error;
    }
  };
}
