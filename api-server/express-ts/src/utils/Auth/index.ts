import { NextFunction, Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import { User } from '../../entities/user.entity';

export const checkUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [authType, aythScheme] = req.headers.authorization?.split(
    ' '
  ) as string[];
  // Authorization header에 Basic 키워드가 없거나 잘못 입력된 경우
  if (authType !== 'Basic') {
    res.status(400).json({
      success: false,
      errorMessage: 'Authorization header type is not Basic'
    });
  }
  const poolClient: PoolClient = await pool.connect();
  const userId = Buffer.from(aythScheme, 'base64')
    .toString('utf8')
    .split(':')[1];
  try {
    if (!(await User.isExistById(poolClient, parseInt(userId)))) {
      res.status(401).json({
        success: false,
        errorMessage: 'The scheme does not exist in table'
      });
    }
    res.locals.userId = userId;
    next();
  } catch (error) {
    next(error);
  } finally {
    poolClient.release();
  }
};
