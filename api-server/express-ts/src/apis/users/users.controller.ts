/** 
 @description user 컨트롤러
 @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
 */

import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import { User } from '../../entities/user.entity';
import jwt from 'jsonwebtoken';
import { Role } from '../../entities/role.entity';
import conf from '../../config';

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
  console.log(userId, res.locals.userId);
  if (+res.locals.userId !== +userId) {
    return res.status(401).json({
      success: false,
      errorMessage:
        "The user's id in token and the url param's id do not match "
    });
  }
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
      'roleId'
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

// POST /users
export const postUser = async (req: Request, res: Response) => {
  // email?(google login일 때만), locale
  const { userinfo } = req.body;
  const poolClient: PoolClient = await pool.connect();

  try {
    if (userinfo.locale === undefined) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Require locale property in Request Body { userinfo }'
      });
    }

    let userId: number;
    let isMember = false;

    console.log('That is test');
    if (
      // users 테이블에 유저 정보가 이미 있는 경우(이미 회원가입 된 유저)
      userinfo.email &&
      (await User.isExistByEmail(poolClient, userinfo.email as string))
    ) {
      userId = (
        await User.findOneByEmail(poolClient, userinfo.email as string, [
          'userId'
        ])
      ).userId;
      isMember = true;
      await new User(userId).updateLatestLogin(poolClient);
    } else {
      // users 테이블에 유저 정보가 없거나 guest인 경우(회원가입)
      // Create a new ussr
      const user: User = new User(
        undefined, // userId
        userinfo.email ? userinfo.email : 'NULL', // email
        userinfo.email
          ? 'member' + String(Date.now()).slice(-8)
          : 'guest' + String(Date.now()).slice(-8), // nickname
        userinfo.locale, // locale
        userinfo.email ? Role.getRoleId('member') : Role.getRoleId('guest') // roleId
      );
      userId = Number((await user.create(poolClient)).userId);
    }

    console.info(`Login \t user_id: ${userId}`);
    // jwt token 생성
    const token = jwt.sign(
      { userId },
      conf.jwtToken.secretKey as string,
      userinfo.email ? conf.jwtToken.option : conf.jwtToken.optionGuest // guest면 만료 기간이 없는 토큰 생성
    );
    res.status(isMember ? 200 : 201).json({ success: true, token, isMember });
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    return res.status(500).json({ sucess: false, errorMessage });
  } finally {
    poolClient.release();
  }
};

// PATCH /users/{userId}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const patchtUserNickname = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { nickname } = req.body;
  if (+res.locals.userId !== +userId) {
    return res.status(401).json({
      success: false,
      errorMessage:
        "The user's id in token and the url param's id do not match "
    });
  }
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+userId)) throw new Error('invalid syntax of params');

    if (!(await User.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const user: User = new User(+userId);
    const updatedUser = await user.updateUserNickname(client, nickname);
    return res.status(200).json({
      success: true,
      user: {
        userId: updatedUser.user_id,
        email: updatedUser.email,
        nickname
      }
    });
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
  if (+res.locals.userId !== +userId) {
    return res.status(401).json({
      success: false,
      errorMessage:
        "The user's id in token and the url param's id do not match "
    });
  }
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+userId)) throw new Error('invalid syntax of params');

    if (!(await User.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const user: User = new User(+userId);
    const deletedUser = await user.delete(client);
    return res.status(200).json({
      success: true,
      user: {
        userId: deletedUser.user_id,
        email: deletedUser.email,
        nickname: deletedUser.nickname
      }
    });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
