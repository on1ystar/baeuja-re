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
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /users/{userId}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUserDetail = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+userId)) throw new Error('invalid syntax of params');

    const user = await User.findOne(client, +userId, [
      'userId',
      'email',
      'nickname',
      'locale',
      'createdAt',
      'latestLogin',
      'modifiedAt',
      'role_id'
    ]);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// PATCH /users/{userId}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const patchtUserNickname = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { nickname } = req.body;
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+userId)) throw new Error('invalid syntax of params');

    if (!(await User.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const user: User = new User(+userId);
    const updatedUser = await user.updateUserNickname(client, nickname);
    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// DELETE /users/{userId}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+userId)) throw new Error('invalid syntax of params');

    if (!(await User.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const user: User = new User(+userId);
    const deletedUser = user.delete(client);
    return res.status(200).json({ success: true, deletedUser });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
