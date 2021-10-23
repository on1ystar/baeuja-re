import { NextFunction, Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import jwt from 'jsonwebtoken';
import conf from '../../config';
import UserRepository from '../../repositories/user.repository';

export const checkUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Authorization header 존재 x
  if (!req.headers.authorization) {
    console.info('Not found Authorization token');
    return res.status(401).json({
      success: false,
      errorMessage: 'Not found Authorization token'
    });
  }
  const [authType, token] = req.headers.authorization?.split(' ') as string[];
  // Authorization header에 Bearer 키워드가 없거나 잘못 입력된 경우
  if (authType.toLowerCase() !== 'bearer') {
    console.info('Invalid bearer keyword');
    return res.status(401).json({
      success: false,
      errorMessage: 'Authorization header type is not Bearer'
    });
  }
  const poolClient: PoolClient = await pool.connect();
  jwt.verify(
    token,
    conf.jwtToken.secretKey as string,
    conf.jwtToken.option,
    async (decodedError, decodedToken) => {
      if (decodedError) {
        console.warn(decodedError);
        return res.status(401).json({
          success: false,
          tokenExpired:
            decodedError?.name === 'TokenExpiredError' ? true : false,
          errorMessage: decodedError?.message
        });
      }
      const userId = decodedToken?.userId;
      const timezone = decodedToken?.timezone;
      try {
        if (!(await UserRepository.isExistById(poolClient, parseInt(userId)))) {
          return res.status(401).json({
            success: false,
            errorMessage: 'The scheme does not exist in table'
          });
        }
        res.locals.userId = userId;
        res.locals.timezone = timezone;
        next();
      } catch (error) {
        next(error);
      } finally {
        poolClient.release();
      }
    }
  );
};
