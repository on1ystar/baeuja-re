import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import conf from '../../config';

beforeAll(done => {
  done();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
describe('e2e Testing users app', () => {
  const token = jwt.sign(
    { userId: 1 },
    conf.jwtToken.secretKey as string,
    conf.jwtToken.option
  );

  describe('GET /users', () => {
    it('should return 200 & valid response {sucess, users}', async () => {
      const res = await request(app)
        .get('/users')
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users[0]).toMatchObject({
        userId: 1,
        email: 'tjdwls0607@gmail.com',
        nickname: 'test1'
      });
    });
  });
});
