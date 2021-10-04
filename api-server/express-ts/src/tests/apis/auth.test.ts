import request from 'supertest';
import app from '../../app';

describe('e2e Testing Auth App', () => {
  beforeAll(async () => {});
  afterAll(async () => {});

  describe('/auth/google', () => {
    it('기록 체크', () => {});
  });
});

// // GET /auth/google
// export const googleRequest = (req: Request, res: Response) => {
//     const googleRequestUrl: string = oauth2Client.generateAuthUrl({
//       // 'online' (default) or 'offline' (gets refresh_token)
//       access_type: 'online',
//       scope: [
//         'https://www.googleapis.com/auth/userinfo.email',
//         'https://www.googleapis.com/auth/userinfo.profile'
//       ]
//     });
//     res.redirect(googleRequestUrl);
//   };

//   // REDIRECT /auth/google/callback
//   // get access token, refresh token, id token
//   export const googleCallback = async (req: Request, res: Response) => {
//     const code = req.query.code as string;
//     const poolClient: PoolClient = await pool.connect();

//     try {
//       // 새로운 access_token, refresh_token 발급
//       const { tokens }: { tokens: Auth.Credentials } =
//         await oauth2Client.getToken(code);
//       oauth2Client.setCredentials(tokens);
//       // email, name, locale
//       const userinfo = await googleOAuth2.getUserinfo();

//       let userId: number;
//       let isMember = false;
//       // DB users 테이블에 유저 정보가 있는 경우
//       if (await User.isExistByEmail(poolClient, userinfo.email as string)) {
//         userId = (
//           await User.findOneByEmail(poolClient, userinfo.email as string, [
//             'userId'
//           ])
//         ).userId;
//         isMember = true;
//         await new User(userId).updateLatestLogin(poolClient);
//       } else {
//         // user 생성
//         const user: User = new User(
//           undefined,
//           userinfo.email as string,
//           'member' + String(Date.now()).slice(-8),
//           userinfo.locale as string,
//           Role.getRoleId('member')
//         );
//         userId = Number((await user.create(poolClient)).userId);
//       }
//       console.info(
//         `Access to Google OAuth2 \t user_id: ${userId}, email: ${userinfo.email}, isMember: ${isMember}`
//       );

//       // jwt token 생성
//       const token = jwt.sign(
//         { userId },
//         conf.jwtToken.secretKey as string,
//         conf.jwtToken.option
//       );

//       res.status(200).json({ success: true, token, isMember });
//     } catch (error) {
//       console.error('❌ Error: auth.controller.ts googleCallback function');
//       console.error(error);
//       const errorMessage = (error as Error).message;
//       return res.status(500).json({ sucess: false, errorMessage });
//     } finally {
//       poolClient.release();
//     }
//   };

//   // POST /auth/guest
//   // guest login
//   export const loginGuest = async (req: Request, res: Response) => {
//     const locale: string = req.body.locale;
//     if (locale === undefined) {
//       return res.status(400).json({
//         success: false,
//         errorMessage: 'Invalid the locale value in Request Body'
//       });
//     }
//     const poolClient: PoolClient = await pool.connect();
//     // user 생성
//     try {
//       const user: User = new User(
//         undefined,
//         'NULL',
//         'guest' + String(Date.now()).slice(-8),
//         locale,
//         Role.getRoleId('guest')
//       );
//       const userId = Number((await user.create(poolClient)).userId);
//       console.info(`Access to Guest \t user_id: ${userId}`);
//       // jwt token 생성
//       const token = jwt.sign(
//         { userId },
//         conf.jwtToken.secretKey as string,
//         conf.jwtToken.optionGuest
//       );
//       res.status(200).json({ success: true, token, isMember: false });
//     } catch (error) {
//       console.error('❌ Error: auth.controller.ts loginGuest function');
//       console.error(error);
//       const errorMessage = (error as Error).message;
//       return res.status(500).json({ sucess: false, errorMessage });
//     } finally {
//       poolClient.release();
//     }
//   };
