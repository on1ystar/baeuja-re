import { pool } from '../db';
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
      platform: 'android',
      country: 'KR',
      timezone: 'Asia/Seoul',
      roleId: 2
    };
  }

  initializeTestDB = async (): Promise<void> => {
    const poolClient = await pool.connect();
    try {
      await poolClient.query('DELETE FROM qna');
      await poolClient.query('DELETE FROM users');
      await poolClient.query(
        'ALTER SEQUENCE "users_user_id_seq" RESTART WITH 1'
      );
      await poolClient.query('ALTER SEQUENCE "qna_qna_id_seq" RESTART WITH 1');
      await poolClient.query(
        'INSERT INTO users(email, nickname, platform, country, timezone, role_id) VALUES($1, $2, $3, $4, $5, $6)',
        [
          this.user.email,
          this.user.nickname,
          this.user.platform,
          this.user.country,
          this.user.timezone,
          this.user.roleId
        ]
      );
    } catch (error) {
      console.warn('Failed initializing test db');
      console.warn(error);
    } finally {
      poolClient.release();
    }
  };

  getUser = (): Record<string, unknown> => this.user;

  getToken = (): string =>
    jwt.sign(
      { userId: this.user.userId, timezone: this.user.timezone },
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

  getNumOfUnitsInContent = async (): Promise<number> =>
    +(
      await pool.query('SELECT count(*) FROM unit WHERE content_id = $1', [
        this.contentId
      ])
    ).rows[0].count;

  getNumOfSentencesInUnit = async (): Promise<number> =>
    +(
      await pool.query(
        'SELECT count(*) FROM sentence WHERE content_id = $1 and unit_index = $2',
        [this.contentId, this.unitIndex]
      )
    ).rows[0].count;

  getNumOfWordsInSentence = async (): Promise<number> =>
    +(
      await pool.query(
        'SELECT count(*) FROM sentence_word WHERE sentence_id = $1',
        [this.sentenceId]
      )
    ).rows[0].count;

  getNumOfSentencesContainingWord = async (): Promise<number> =>
    +(
      await pool.query(
        'SELECT count(*) FROM sentence_word WHERE word_id = $1',
        [this.wordId]
      )
    ).rows[0].count;

  getNumOfWords = async (): Promise<number> =>
    +(await pool.query('SELECT count(*) FROM word ')).rows[0].count;
}
