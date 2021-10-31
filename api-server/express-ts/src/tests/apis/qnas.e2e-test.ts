import request from 'supertest';
import app from '../../app';
import TestSetup from '../e2eTestSetup';

const testSetup = new TestSetup();
const qnaId = 1;
const qna = {
  title: 'test',
  content: 'This is e2e testing',
  qnaTypeId: 4
};
let token: string;
beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing qnas app', () => {
  // get qnas list
  describe('GET /qnas', () => {
    it('should valid response qnas list', async () => {
      const res = await request(app)
        .get('/qnas')
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qnas.length).toBe(0);
    });
    it('should return 401 if not found authorization token', async () => {
      const res = await request(app).get('/qnas');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
  // post qna (문의 등록)
  describe('POST /qnas', () => {
    it('should valid response a created qna id', async () => {
      const res = await request(app)
        .post(`/qnas`)
        .send({ qna })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.qna.qnaId).toBe(qnaId);
    });
    it('should return 400 if request invalid data in Request-Body', async () => {
      const res = await request(app)
        .post(`/qnas`)
        .send({})
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // get a qna
  describe('GET /qnas/:qnaId', () => {
    it('should valid response a qna object', async () => {
      const res = await request(app)
        .get(`/qnas/${qnaId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qna.qnaId).toBe(qnaId);
      expect(res.body.qna.title).toBe(qna.title);
      expect(res.body.qna.content).toBe(qna.content);
      expect(res.body.qna.qnaTypeId).toBe(qna.qnaTypeId);
    });
    it('should return 400 if not found qnaId in path', async () => {
      const res = await request(app)
        .get(`/qnas/${qnaId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // update qna answer (문의 답변)
  describe('PATCH /qnas/:qnaId', () => {
    it('should valid response a answered qna Id', async () => {
      const answer = 'This is answer for testing';
      const res = await request(app)
        .patch(`/qnas/${qnaId}`)
        .send({ answer })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qna.qnaId).toBe(qnaId);
      expect(res.body.qna.answer).toBe(answer);
    });
    it('should return 400 if not found qnaId in path', async () => {
      const res = await request(app)
        .patch(`/qnas/${qnaId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // remove qna
  describe('DELETE /qnas/:qnaId', () => {
    it('should valid response a deleted qna id', async () => {
      const res = await request(app)
        .delete(`/qnas/${qnaId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qna.qnaId).toBe(qnaId);
    });
    it('should return 400 if not found qnaId in path', async () => {
      const res = await request(app)
        .delete(`/qnas/${qnaId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  // get qna all types
  describe('GET /qnas/types', () => {
    it('should valid response the qna types list', async () => {
      const res = await request(app)
        .get(`/qnas/types`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qnaTypes.length).toBe(4);
    });
  });
});
