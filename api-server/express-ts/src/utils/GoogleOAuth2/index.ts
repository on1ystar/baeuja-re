// /**
//     @description Config Google OAuth 2.0
//     @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
// */

// import conf from '../../config';
// import { Auth, oauth2_v2 } from 'googleapis';
// import { NextFunction, Request, Response } from 'express';

// const CALLBACK_URL = '/auth/google/callback';

// export class GoogleOAuth2 {
//   readonly oauth2Client: Auth.OAuth2Client;

//   constructor() {
//     this.oauth2Client = new Auth.OAuth2Client(
//       conf.googleApi.clientId,
//       conf.googleApi.secret,
//       process.env.RUN === 'dev'
//         ? `${conf.url.local}${CALLBACK_URL}`
//         : `${conf.url.domain}${CALLBACK_URL}`
//     );
//   }

//   getOAuth2Client(): Auth.OAuth2Client {
//     return this.oauth2Client;
//   }

//   // access token을 사용해 Google API로 부터 email, name, locale 정보 요청
//   getUserinfo = async () => {
//     try {
//       const oauth2: oauth2_v2.Oauth2 = new oauth2_v2.Oauth2({
//         auth: this.oauth2Client
//       });
//       const { email, name, locale } = (await oauth2.userinfo.v2.me.get()).data;
//       return { email, name, locale };
//     } catch (error) {
//       console.error('❌ Error: GoogleOAuth2 getUserinfo function');
//       throw error;
//     }
//   };

//   // middleAuth = async (req: Request, res: Response, next: NextFunction) => {
//   //   try {
//   //     if (!req.headers.authorization)
//   //       throw new Error('AuthourizationError: No Authorization header');

//   //     const [bearer, token] = req.headers.authorization?.split(' ');
//   //     if (bearer !== 'Bearer')
//   //       throw new Error('AuthourizationError: invalid Bearer');

//   //     // token이 없는 경우 -> login
//   //     if (!token) return res.redirect('https://api.k-peach.io/auth/google');

//   //     // token invalid
//   //     if (true) {
//   //       throw new Error('AuthourizationError: invalid token');
//   //     }

//   //     // access token 유효 기간 만료
//   //     if (true) {
//   //       // refresh token 요청
//   //       // refresh token도 없거나 만료
//   //       if (true) {
//   //         // 로그인
//   //         if (!token) return res.redirect('https://api.k-peach.io/auth/google');
//   //       }
//   //     }

//   //     // id or email 정보 요청 후 리턴
//   //   } catch (error) {
//   //     return res.status(401).json({
//   //       success: false,
//   //       errorMessage: error.message
//   //     });
//   //   }

//   // // Sets the auth credentials(토큰)
//   // oauth2Client.setCredentials(tokens);
//   // // email, name, locale
//   // const userinfo = await googleOAuth2.getUserinfo();
//   // // 이미 가입되어 있는 사용자가 refresh token을 재발급 받기 위해
//   // if (await User.isExist(poolClient, userinfo.email as string)) {
//   //   oauth2Client.setCredentials({
//   //     refresh_token: `STORED_REFRESH_TOKEN`
//   //   });
//   // } else {
//   //   // user 생성
//   //   const user = new User(
//   //     userinfo.email as string,
//   //     userinfo.name as string,
//   //     userinfo.locale as string,
//   //     tokens.refresh_token as string
//   //   );
//   //   const createdUser = await user.create(poolClient);
//   //   console.info(
//   //     `user_id: ${createdUser.userId}, email: ${createdUser.email}`
//   //   );}
// }
