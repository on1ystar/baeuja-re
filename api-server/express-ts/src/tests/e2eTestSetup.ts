import { pool } from '../db';
import { getNowKO } from '../utils/Date';
import jwt from 'jsonwebtoken';
import conf from '../config';

export default class TestSetup {
  readonly user: Record<string, unknown>;

  constructor(
    readonly contentId?: number | undefined,
    readonly unitIndex?: number | undefined,
    readonly sentenceId?: number | undefined,
    readonly wordId?: number | undefined
  ) {
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

  getNumOfContents = async (): Promise<number> =>
    +(await pool.query('SELECT count(*) FROM content')).rows[0].count;

  getNumOfUnits = async (): Promise<number> =>
    +(
      await pool.query('SELECT count(*) FROM unit WHERE content_id = $1', [
        this.contentId
      ])
    ).rows[0].count;

  getNumOfSentences = async (): Promise<number> =>
    +(
      await pool.query(
        'SELECT count(*) FROM sentence WHERE content_id = $1 and unit_index = $2',
        [this.contentId, this.unitIndex]
      )
    ).rows[0].count;

  getNumOfWords = async (): Promise<number> =>
    +(
      await pool.query('SELECT count(*) FROM word WHERE sentence_id = $1', [
        this.sentenceId
      ])
    ).rows[0].count;
}
