/*
  - Date : 2021. 07. 18 
  - Creator : 정성진 ( tjdwls0607@naver.com )
  - Version : v1.0.0 
  - Description : utility middleware
*/
import multer from 'multer';
import jwt from 'jsonwebtoken';
import conf from './config';
import dbClient from './dbConnect';

const storage = multer.memoryStorage();

// multer middleware for parsing file info from request
export const middleMulter = multer({
  storage
  // fileFilter(req, file, cb) {}
});

// 토큰 기반 인증을 사용한 인증 미들웨어
// 인증 타입 : bearer, 토큰 : jwt
export const middleAuth = async (req, res, next) => {
  // http headers에 포함 -> Authorization: <bearer> <token>
  if (!req.headers.authorization) {
    console.log('AuthourizationError: No Authorization header');
    return res.status(400).json({
      success: false,
      errorMessage:
        'invalid keyword, Check valid header format -> Authourization: <bearer> <token>'
    });
  }
  const [bearer, token] = req.headers.authorization.split(' ');
  if (bearer !== 'bearer') {
    console.log('AuthourizationError: invalid bearer');
    return res.status(400).json({
      success: false,
      errorMessage:
        'invalid keyword, Check valid header format -> Authourization: <bearer> <token>'
    });
  }
  if (!token) {
    console.log('Error : Token not found');
    return res
      .status(400)
      .json({ success: false, errorMessage: 'Token not found' });
  }
  try {
    const { id, email, iss } = await jwt.verify(token, conf.jwt.secretKey); // jwt 토큰 디코딩
    const query = {
      name: 'selectAdminByIdAndEmail',
      text: 'SELECT * FROM admin WHERE id = $1 and email = $2',
      values: [id, email]
    };
    try {
      const admin = (await dbClient.query(query)).rows[0]; // admin 테이블에 id와 email이 일치하는 admin 계정 확인
      // 일치하는 admin 계정이 없는 경우
      if (!admin) {
        console.log('InvalidIdOrEmailError: ', 'Admin does not exist');
        return res
          .status(403)
          .json({ success: false, errorMessage: 'invalid jwt' });
      }
      // 디코딩 한 토큰의 issuer가 다른 경우
      if (iss !== conf.jwt.options.issuer) {
        console.log('InvalidIssuerError: ', 'Issuer does not matched');
        return res
          .status(403)
          .json({ success: false, errorMessage: 'invalid jwt' });
      }
    } catch (error) {
      console.log('selectAdminByIdAndEmailError: ', error);
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(403)
      .json({ success: false, errorMessage: 'invalid jwt' });
  }
  next();
};
