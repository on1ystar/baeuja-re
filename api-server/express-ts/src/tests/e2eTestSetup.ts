import { pool } from '../db';
import { getNowKO } from '../utils/Date';
import jwt from 'jsonwebtoken';
import conf from '../config';

export default class TestSetup {
  readonly user: Record<string, unknown>;

  constructor(user?: Record<string, unknown>) {
    if (user) this.user = user;
    else
      this.user = {
        userId: 1,
        email: 'test@test.com',
        nickname: 'test1',
        locale: 'ko',
        roleId: 2
      };
  }

  initializeTestDB = async (): Promise<void> => {
    const poolClient = await pool.connect();
    try {
      poolClient.query('DELETE FROM users');
      poolClient.query('ALTER SEQUENCE "users_user_id_seq" RESTART WITH 1');
      poolClient.query(
        'INSERT INTO users VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7)',
        [
          this.user.email,
          this.user.nickname,
          this.user.locale,
          getNowKO(),
          getNowKO(),
          getNowKO(),
          this.user.roleId
        ]
      );
    } catch (error) {
      console.error('Failed initializing test db');
      console.error(error);
    } finally {
      poolClient.release();
    }
  };

  getUser = (): Record<string, unknown> => this.user;

  getToken = (): string =>
    jwt.sign(
      { userId: this.user.userId },
      conf.jwtToken.secretKey as string,
      conf.jwtToken.option
    );

  getExpiredToken = (): string =>
    jwt.sign(
      { userId: this.user.userId },
      conf.jwtToken.secretKey as string,
      conf.jwtToken.optionExpired
    );
}
