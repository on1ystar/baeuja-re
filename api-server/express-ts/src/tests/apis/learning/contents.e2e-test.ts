import request from 'supertest';
import app from '../../../app';
import { pool } from '../../../db';
import TestSetup from '../../e2eTestSetup';

const userId = 1;
const contentId = 1;
const unitIndex = 1;
const sentenceId = 1;
let token: string;
const testSetup = new TestSetup(contentId, unitIndex, sentenceId);
let numOfContents: number;
let numOfUnits: number;
let numOfSentences: number;
let numOfWords: number;

beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
  numOfContents = await testSetup.getNumOfContents();
  numOfUnits = await testSetup.getNumOfUnits();
  numOfSentences = await testSetup.getNumOfSentences();
  numOfWords = await testSetup.getNumOfWords();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing learning/contents app', () => {
  // 콘텐츠 리스트
  describe('GET /contents', () => {
    it('should vaild response all the contents list', async () => {
      const res = await request(app)
        .get('/learning/contents')
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.contents.length).toBe(numOfContents);
      expect(res.body.contents[contentId - 1].contentId).toBe(contentId);
    });
  });

  it('should return 401 if not found authorization token', async () => {
    const res = await request(app).get('/learning/contents');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.errorMessage).toBe('Not found Authorization token');
  });

  // 콘텐츠 디테일
  describe('GET /content/:contentId', () => {
    it('should valid response a content detail data object', async () => {
      const res = await request(app)
        .get(`/learning/contents/${contentId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.content.contentId).toBe(contentId);
    });

    it('should return 400 if the contentIddoes not exist', async () => {
      const res = await request(app)
        .get(`/learning/contents/${numOfContents + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorMessage).toBe('contentId does not exist');
    });
  });

  // 콘텐츠 유닛 리스트
  describe('GET /content/:contentId/units', () => {
    it('should vaild response all the units list of :contnetId and create a content learning history', async () => {
      const res = await request(app)
        .get(`/learning/contents/${contentId}/units`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.units.length).toBe(numOfUnits);
      expect(res.body.units[unitIndex - 1].contentId).toBe(contentId);
      expect(res.body.units[unitIndex - 1].unitIndex).toBe(unitIndex);
      // 학습 기록 저장 테스트
      expect(
        +(
          await pool.query(
            'SELECT counts FROM user_content_history \
          WHERE user_id = $1 AND content_id = $2',
            [userId, contentId]
          )
        ).rows[0].counts
      ).toBe(1);
    });

    // 학습 기록 저장 테스트
    it('should increase learning history of unit and sentences', async () => {
      await request(app)
        .get(`/learning/contents/${contentId}/units`)
        .auth(token, { type: 'bearer' });
      expect(
        +(
          await pool.query(
            'SELECT counts FROM user_content_history \
          WHERE user_id = $1 AND content_id = $2',
            [userId, contentId]
          )
        ).rows[0].counts
      ).toBe(2);
    });
  });

  // 콘텐츠 유닛 학습
  describe('GET /content/:contentId/units/:unitIndex', () => {
    it('should valid response a unit object with sentences and words', async () => {
      const res = await request(app)
        .get(`/learning/contents/${contentId}/units/${unitIndex}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.unit.contentId).toBe(contentId);
      expect(res.body.unit.unitIndex).toBe(unitIndex);
      expect(res.body.sentences.length).toBe(numOfSentences);
      expect(res.body.sentences[0].words.length).toBe(numOfWords);
      // 학습 기록 저장 테스트
      expect(
        +(
          await pool.query(
            'SELECT progress_rate FROM user_content_history \
          WHERE user_id = $1 AND content_id = $2',
            [userId, contentId]
          )
        ).rows[0].progress_rate
      ).toBeGreaterThan(0);
      expect(
        +(
          await pool.query(
            'SELECT counts FROM user_unit_history \
          WHERE user_id = $1 AND content_id = $2 AND unit_index = $3',
            [userId, contentId, unitIndex]
          )
        ).rows[0].counts
      ).toBe(1);
      expect(
        +(
          await pool.query(
            'SELECT count(*) FROM user_sentence_history \
          WHERE user_id = $1',
            [userId]
          )
        ).rows[0].count
      ).toBe(numOfSentences);
    });

    // 학습 기록 저장 테스트
    it('should increase learning history of unit and sentences', async () => {
      await request(app)
        .get(`/learning/contents/${contentId}/units/${unitIndex}`)
        .auth(token, { type: 'bearer' });
      expect(
        +(
          await pool.query(
            'SELECT counts FROM user_unit_history \
            WHERE user_id = $1 AND content_id = $2 AND unit_index = $3',
            [userId, contentId, unitIndex]
          )
        ).rows[0].counts
      ).toBe(2);
    });
  });
});
