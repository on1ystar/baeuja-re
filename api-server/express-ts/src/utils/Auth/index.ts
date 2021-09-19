import { NextFunction, Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import { User } from '../../entities/user.entity';

export const checkUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // request body에 userId가 없을 경우
  if (req.body.userId === undefined) {
    res.status(400).json({
      success: false,
      errorMessage: 'A userId is undefined in request.body'
    });
  }
  const poolClient: PoolClient = await pool.connect();

  try {
    if (!(await User.isExistById(poolClient, parseInt(req.body.userId)))) {
      res.status(400).json({
        success: false,
        errorMessage: 'The userId does not exist in table'
      });
    }
    next();
  } catch (error) {
    throw error;
  } finally {
    poolClient.release();
  }
};
