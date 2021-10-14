import app from '../../../app';
import TestSetup from '../../e2eTestSetup';
import request from 'supertest';
import { pool } from '../../../db';
import fs from 'fs';

const userId = 1;
const contentId = 1;
const unitIndex = 1;
const sentenceId = 1;
const wordId = 1;
const testSetup = new TestSetup(contentId, unitIndex, sentenceId, wordId);
let numOfWords: number;
let numOfSentencesContainingWord: number;
let token: string;

beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
  numOfWords = await testSetup.getNumOfWords();
  numOfSentencesContainingWord =
    await testSetup.getNumOfSentencesContainingWord();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing learning/words app', () => {
  // 학습 단어
  describe('GET /learning/words/:wordId', () => {
    it('should valid response a word and create a learning history', async () => {
      const res = await request(app)
        .get(`/learning/words/${wordId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.word.wordId).toBe(1);
    });
    it('should increase the user_word_history counts column', async () => {
      const res = await request(app)
        .get(`/learning/words/${wordId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(
        +(
          await pool.query(
            'SELECT counts FROM user_word_history \
          WHERE user_id = $1 AND word_id = $2',
            [userId, wordId]
          )
        ).rows[0].counts
      ).toBe(2);
    });
    it('should return 400 if not found wordId in word table', async () => {
      const res = await request(app)
        .get(`/learning/words/${numOfWords + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // 학습 단어의 예시 문장들
  describe('GET /learning/words/:wordId/sentences', () => {
    it('should valid response example sentences', async () => {
      const res = await request(app)
        .get(`/learning/words/${wordId}/sentences`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sentences.length).toBe(numOfSentencesContainingWord);
    });
    it('should return 400 if not found wordId in word table', async () => {
      const res = await request(app)
        .get(`/learning/words/${numOfWords + 1}/sentences`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // 단어 학습 기록
  describe('POST /learning/words/:wordId/userWordHistory', () => {
    it('should increase perfectVoiceCounts if the column query is perfectVoiceCounts', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordHistory`)
        .auth(token, { type: 'bearer' })
        .query({ column: 'perfectVoiceCounts' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.success).toBe(true);
      expect(res.body.wordHistory).toMatchObject({
        userId,
        wordId,
        perfectVoiceCounts: 1
      });
    });
    it('should increase userVoiceCounts if the column query is userVoiceCounts', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordHistory`)
        .auth(token, { type: 'bearer' })
        .query({ column: 'userVoiceCounts' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.success).toBe(true);
      expect(res.body.wordHistory).toMatchObject({
        userId,
        wordId,
        userVoiceCounts: 1
      });
    });
    it('should return 400 if the column query not found', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordHistory`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
    it('should return 400 if the column query is not perfectVoiceCounts or userVoiceCounts', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordHistory`)
        .auth(token, { type: 'bearer' })
        .query({ column: 'anything' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
    it('should return 400 if not found wordId in word table', async () => {
      const res = await request(app)
        .post(`/learning/words/${numOfWords + 1}/userWordHistory`)
        .auth(token, { type: 'bearer' })
        .query({ column: 'userVoiceCounts' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // 단어 발화 평가
  describe('POST /learning/words/:wordId/userWordEvaluation', () => {
    it('should valid response the result of word speech evaluation', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordEvaluation`)
        .auth(token, { type: 'bearer' })
        .attach(
          'userVoice',
          fs.createReadStream(`${__dirname}/../../audio/1.wav`),
          '1.wav'
        );
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.evaluatedWord.userId).toBe(userId);
      expect(res.body.evaluatedWord.wordId).toBe(wordId);
      expect(res.body.evaluatedWord.wordEvaluationCounts).toBe(1);
      expect(res.body.pitchData).toHaveProperty('perfectVoice');
    });
    it('should increase the counts of word speech evaluation', async () => {
      const res = await request(app)
        .post(`/learning/words/${wordId}/userWordEvaluation`)
        .auth(token, { type: 'bearer' })
        .attach(
          'userVoice',
          fs.createReadStream(`${__dirname}/../../audio/1.wav`),
          '1.wav'
        );
      expect(res.body.evaluatedWord.wordEvaluationCounts).toBe(2);
    });
    it('should return 400 if not found wordId in word table', async () => {
      const res = await request(app)
        .post(`/learning/words/${numOfWords + 1}/userWordEvaluation`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
