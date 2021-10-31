import request from 'supertest';
import app from '../../app';
import TestSetup from '../e2eTestSetup';

const contentId = 1;
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
  // New contents
  describe('GET /home/contents', () => {
    it('should valid response new contents list', async () => {
      const res = await request(app)
        .get(`/home/contents`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.contents.length).toBe(5);
    });

    it('should return 401 if not found authorization header', async () => {
      const res = await request(app).get(`/home/contents`);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
  // Random recommendations
  describe('GET /home/recommendations', () => {
    it('should valid response recommendations list', async () => {
      const res = await request(app)
        .get(`/home/recommendations`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.words.length).toBe(5);
    });
  });
});
