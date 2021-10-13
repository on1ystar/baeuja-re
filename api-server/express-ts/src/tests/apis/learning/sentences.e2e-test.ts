import request from 'supertest';
import app from '../../../app';
import { pool } from '../../../db';
import { getNowKO } from '../../../utils/Date';
import TestSetup from '../../e2eTestSetup';
import fs from 'fs';

const userId = 1;
const sentenceId = 1;
let token: string;
const testSetup = new TestSetup();

beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
  await pool.query(
    'INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES($1,$2,$3,$4)',
    [userId, sentenceId, getNowKO(), 0]
  );
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing learning/sentences app', () => {
  // 발화 평가
  describe('POST /learning/sentences/:sentenceId/userSentenceEvaluation', () => {
    it('should valid response the result of speech evaluation', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceEvaluation`)
        .auth(token, { type: 'bearer' })
        .attach(
          'userVoice',
          fs.createReadStream(`${__dirname}/../../audio/1.wav`),
          '1.wav'
        );
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.evaluatedSentence.userId).toBe(userId);
      expect(res.body.evaluatedSentence.sentenceId).toBe(sentenceId);
      expect(res.body.evaluatedSentence.sentenceEvaluationCounts).toBe(1);
      expect(res.body.pitchData).toHaveProperty('perfectVoice');
    });

    it('should increase the sentence evaluation counts', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceEvaluation`)
        .auth(token, { type: 'bearer' })
        .attach(
          'userVoice',
          fs.createReadStream(`${__dirname}/../../audio/1.wav`),
          '1.wav'
        );
      expect(res.body.evaluatedSentence.sentenceEvaluationCounts).toBe(2);
    });
  });
  // 성우 음성 재생 기록
  describe('POST /learning/sentences/:sentenceId/userSentenceHistory', () => {
    it('should valid response the perfect voice counts', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .query({ column: 'perfectVoiceCounts' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.sentenceHistory).toMatchObject({
        userId,
        sentenceId,
        perfectVoiceCounts: 1
      });
    });

    it('should increase the perfect voice counts', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .query({ column: 'perfectVoiceCounts' })
        .auth(token, { type: 'bearer' });
      expect(res.body.sentenceHistory.perfectVoiceCounts).toBe(2);
    });

    it('should return 404 if the column query not found', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .auth(token, { type: 'bearer' });
      expect(res.body.success).toBe(false);
      expect(res.body.errorMessage).toBe("invalid query string's syntax");
    });

    it('should return 404 if the column query not found', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .query({ column: 'anything' })
        .auth(token, { type: 'bearer' });
      expect(res.body.success).toBe(false);
      expect(res.body.errorMessage).toBe("invalid query string's syntax");
    });
  });
  // 사용자 음성 재생 기록
  describe('POST /learning/sentences/:sentenceId/userSentenceHistory', () => {
    it('should valid response the user voice counts', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .query({ column: 'userVoiceCounts' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.sentenceHistory).toMatchObject({
        userId,
        sentenceId,
        userVoiceCounts: 1
      });
    });

    it('should increase the user voice counts', async () => {
      const res = await request(app)
        .post(`/learning/sentences/${sentenceId}/userSentenceHistory`)
        .query({ column: 'userVoiceCounts' })
        .auth(token, { type: 'bearer' });
      expect(res.body.sentenceHistory.userVoiceCounts).toBe(2);
    });
  });
});
