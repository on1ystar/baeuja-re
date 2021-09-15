/**
    @description 사용자 인증을 위한 컨트롤러
    @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
*/

import { Request, Response } from 'express';
import conf from '../config';
import { google } from 'googleapis';

const CALLBACK_URL = '/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  conf.googleApi.clientId,
  conf.googleApi.secret,
  process.env.RUN === 'dev'
    ? `${conf.url.local}${CALLBACK_URL}`
    : `${conf.url.domain}${CALLBACK_URL}`
);

const googleRequestUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
});

// /auth/google
export const googleRequest = (req: Request, res: Response) => {
  res.redirect(googleRequestUrl);
};

// /auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
    console.log(await oauth2.userinfo.v2.me.get());
  } catch (error) {
    console.log(error);
  }
  // refresh_token 저장
  // oauth2Client.on('tokens', (tokens) => {
  //   if (tokens.refresh_token) {
  //     // store the refresh_token in my database!
  //     console.log(tokens.refresh_token);
  //   }
  //   console.log(tokens.access_token);
  // });
  res.send('googleCallback');
};
