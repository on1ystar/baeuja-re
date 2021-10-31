import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import conf from '../../config';
import TestSetup from '../e2eTestSetup';

const TIMEZONE = 'Asia/Seoul';
const testSetup = new TestSetup();
const userId = 1;
const postUserinfo = {
  google: {
    email: 'test2@test.com',
    platform: 'android',
    country: 'KR',
    timezone: TIMEZONE
  },
  guest: {
    platform: 'ios',
    country: 'KR',
    timezone: TIMEZONE
  }
};
let token: string;
beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing users app', () => {
  describe('GET /users', () => {
    it('should valid response user objects list', async () => {
      const { email, nickname } = testSetup.getUser();
      const res = await request(app)
        .get('/users')
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users[0]).toMatchObject({
        userId,
        email,
        nickname
      });
    });

    it('should return 401 if not found authorization token', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorMessage).toBe('Not found Authorization token');
    });
  });

  describe('POST /users ', () => {
    it('should valid response a token with isMember(false) if login for the first time with Google email', async () => {
      const res = await request(app)
        .post('/users')
        .send({ userinfo: postUserinfo.google });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.isMember).toBe(false);
      jwt.verify(
        res.body.token,
        conf.jwtToken.secretKey as string,
        conf.jwtToken.option,
        (decodedError, decodedToken) => {
          expect(decodedToken?.userId).toBe(2);
          expect(decodedToken?.timezone).toBe(TIMEZONE);
        }
      );
    });

    it('should valid response a token with isMember(true) if login again with Google email', async () => {
      const res = await request(app)
        .post('/users')
        .send({ userinfo: postUserinfo.google });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isMember).toBe(true);
    });

    it('should valid response a token with isMember(false) if login again with Guest', async () => {
      const res = await request(app)
        .post('/users')
        .send({ userinfo: postUserinfo.guest });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.isMember).toBe(false);
    });

    it('should valid response user objects list length = 3 if success to create users', async () => {
      const res = await request(app)
        .get('/users')
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users.length).toBe(3);
    });
  });

  describe('GET /users/:userId', () => {
    it("should valid response user's detail object", async () => {
      const res = await request(app)
        .get(`/users/${userId}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const ats = {
        createdAt: null,
        latestLogin: null,
        modifiedAt: null
      };
      expect({ ...res.body.user, ...ats }).toMatchObject({
        ...testSetup.getUser(),
        ...ats
      });
    });

    it("should return 401 if the user's id in token and the url param's id do not match", async () => {
      const res = await request(app)
        .get(`/users/${userId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should valid response updated a user object', async () => {
      const { email } = testSetup.getUser();
      const res = await request(app)
        .patch(`/users/${userId}`)
        .send({ nickname: 'updatedNickname' })
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toMatchObject({
        userId,
        email,
        nickname: 'updatedNickname'
      });
    });

    it("should return 401 if the user's id in token and the url param's id do not match", async () => {
      const res = await request(app)
        .patch(`/users/${userId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should valid response deleted a user object', async () => {
      const { email } = testSetup.getUser();
      const res = await request(app)
        .delete(`/users/1`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toMatchObject({
        userId,
        email,
        nickname: 'updatedNickname'
      });
    });

    it("should return 401 if the user's id in token and the url param's id do not match", async () => {
      const res = await request(app)
        .delete(`/users/${userId + 1}`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
