import request from 'supertest';
import app from '../../app';
import { pool } from '../../db';
import TestSetup from '../e2eTestSetup';

const userId = 1;
const sentenceId = 1;
const wordId = 1;
let token: string;
const testSetup = new TestSetup();

beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
  await pool.query(
    'INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 1, '2021.10.14 00:00:00', 0]
  );
  await pool.query(
    'INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 2, '2021.10.15 00:00:00', 0]
  );
  await pool.query(
    'INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 3, '2021.10.16 00:00:00', 0]
  );
  await pool.query(
    'INSERT INTO user_word_history(user_id, word_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 1, '2021.10.14 00:00:00', 0]
  );
  await pool.query(
    'INSERT INTO user_word_history(user_id, word_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 2, '2021.10.15 00:00:00', 0]
  );
  await pool.query(
    'INSERT INTO user_word_history(user_id, word_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, 3, '2021.10.16 00:00:00', 0]
  );
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing bookmark app', () => {
  // 문장 즐겨찾기 추가/삭제
  describe('POST /bookmark/sentences/:sentenceId', () => {
    it('should valid response isBookmark = true', async () => {
      const res = await request(app)
        .post(`/bookmark/sentences/${sentenceId}`)
        .auth(token, { type: 'bearer' });
      await request(app)
        .post(`/bookmark/sentences/2`)
        .auth(token, { type: 'bearer' });
      await request(app)
        .post(`/bookmark/sentences/3`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(true);
    });

    it('should valid response isBookmark = false', async () => {
      const res = await request(app)
        .post(`/bookmark/sentences/${sentenceId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(false);
    });
  });
  // 즐겨찾기된 문장 리스트
  describe('GET /bookmark/sentences', () => {
    it('should valid response the bookmark sentences', async () => {
      const res = await request(app)
        .get(`/bookmark/sentences`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sentences.length).toBe(2);
    });
    it('should valid response the bookmark sentences sorted by latest_learning_at ASC', async () => {
      const res = await request(app)
        .get(`/bookmark/sentences`)
        .query({ sortBy: 'latest_learning_at', option: 'ASC' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sentences.length).toBe(2);
      expect(res.body.sentences[0].sentenceId).toBe(2); // sentenceId = 2이 sentenceid = 3보다 이전에 학습
    });
    it("should return invalid query string's syntax", async () => {
      const res = await request(app)
        .get(`/bookmark/sentences`)
        .query({ option: 'anything' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return invalid query string's syntax", async () => {
      const res = await request(app)
        .get(`/bookmark/sentences`)
        .query({ sortBy: 'anything', option: 'ASC' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // 단어 즐겨찾기 추가/삭제
  describe('POST /bookmark/words/:wordId', () => {
    it('should valid response isBookmark = true', async () => {
      const res = await request(app)
        .post(`/bookmark/words/${wordId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(true);
    });

    it('should valid response isBookmark = false', async () => {
      const res = await request(app)
        .post(`/bookmark/words/${wordId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(false);
    });

    it('should valid response isBookmark = true', async () => {
      const res = await request(app)
        .post(`/bookmark/words/2`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(true);
    });

    it('should valid response isBookmark = true', async () => {
      const res = await request(app)
        .post(`/bookmark/words/3`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isBookmark).toBe(true);
    });
  });
  // 즐겨찾기된 단어 리스트
  describe('GET /bookmark/words', () => {
    it('should valid response the bookmark words', async () => {
      const res = await request(app)
        .get(`/bookmark/words`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.words.length).toBe(2);
    });
    it('should valid response the bookmark words sorted by latest_learning_at ASC', async () => {
      const res = await request(app)
        .get(`/bookmark/words`)
        .query({ sortBy: 'latest_learning_at', option: 'ASC' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.words.length).toBe(2);
      expect(res.body.words[0].wordId).toBe(2); // wordId = 2이 wordId = 3보다 이전에 학습
    });
    it("should return invalid query string's syntax", async () => {
      const res = await request(app)
        .get(`/bookmark/words`)
        .query({ option: 'anything' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return invalid query string's syntax", async () => {
      const res = await request(app)
        .get(`/bookmark/words`)
        .query({ sortBy: 'anything', option: 'ASC' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
