/**
    @description 로그인 화면 -> google login 클릭 -> googleRequestUrl로 code 요청 -> googleCallback으로 code 응답 -> code를 포함해 토큰 요청 -> 토큰 반환
    @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
*/

import { Request, Response } from 'express';
import { Auth } from 'googleapis';
import { pool } from '../db';
import { GoogleOAuth2 } from '../utils/GoogleOAuth2';
import { User } from '../entities/user.entity';
import { PoolClient } from 'pg';

const googleOAuth2 = new GoogleOAuth2();
const oauth2Client = googleOAuth2.getOAuth2Client();

// /auth/google
export const googleRequest = (req: Request, res: Response) => {
  const googleRequestUrl: string = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });
  res.redirect(googleRequestUrl);
};

// /auth/google/callback
// get access token, refresh token, id token
export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const poolClient: PoolClient = await pool.connect();

  try {
    // 새로운 access_token, refresh_token 발급
    const { tokens }: { tokens: Auth.Credentials } =
      await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // email, name, locale
    const userinfo = await googleOAuth2.getUserinfo();

    let userId: number;
    // DB users 테이블에 유저 정보가 있는 경우
    if (await User.isExist(poolClient, userinfo.email as string)) {
      userId = await User.findOneByEmail(
        poolClient,
        userinfo.email as string,
        'userId'
      );
    } else {
      // user 생성
      const user = new User(
        userinfo.email as string,
        userinfo.name as string,
        userinfo.locale as string
      );
      userId = (await user.create(poolClient)).userId as unknown as number;
    }
    console.info(`user_id: ${userId}, email: ${userinfo.email}`);
    res.status(200).json({ success: true, userId });
  } catch (error) {
    console.error('❌ Error: auth.controller.ts googleCallback function');
    console.error(error);
    return res.status(500).json({ sucess: false, errorMessage: error.message });
  } finally {
    poolClient.release();
  }
};
