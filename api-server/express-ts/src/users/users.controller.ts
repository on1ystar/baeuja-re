/** 
 @description user 컨트롤러
 @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
 */

import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../db';
import { User } from '../entities/user.entity';

// GET /users
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUsers = async (req: Request, res: Response) => {
  const client: PoolClient = await pool.connect();
  try {
    const users = await User.find(client, ['userId', 'email', 'nickname']);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  } finally {
    client.release();
  }
};

// DELETE /users/{userId}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteUser = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const client: PoolClient = await pool.connect();
  try {
    const deletedUser = await User.delete(client, userId);
    return res.status(200).json({ success: true, deletedUser });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  } finally {
    client.release();
  }
};
