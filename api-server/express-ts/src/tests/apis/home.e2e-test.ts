import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import conf from '../../config';
import TestSetup from '../e2eTestSetup';

const userId = 1;
const contentId = 1;
const unitIndex = 1;
const sentenceId = 1;
const testSetup = new TestSetup(contentId);
let token: string;
beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing home app', () => {
  describe('GET /home/contents', () => {
    it('should valid response new contents list', async () => {
      const res = await request(app).get(`/home/contents`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.contents.length).toBe(5);
    });
  });
});
