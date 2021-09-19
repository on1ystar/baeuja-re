import { NextFunction, Request, Response } from 'express';
import { pool } from '../../db';

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

  try {
    const poolClient: PoolClient = await pool.connect();
  } catch (error) {}
};
