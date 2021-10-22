/** 
 @description user 컨트롤러
 @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
 */

import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import User from '../../entities/user.entity';
import jwt from 'jsonwebtoken';
import Role from '../../entities/role.entity';
import conf from '../../config';
import UserRepository, {
  UserToBeSaved
} from '../../repositories/user.repository';

// GET /users
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUsers = async (req: Request, res: Response) => {
  const client: PoolClient = await pool.connect();
  try {
    const users: User[] = await UserRepository.findAll(client, [
      'userId',
      'email',
      'nickname'
    ]);
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

    const user: User = await UserRepository.findOne(client, +userId, [
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
  const { userinfo } = req.body;
  const client: PoolClient = await pool.connect();

  try {
    if (userinfo.locale === undefined) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Require locale property in Request Body { userinfo }'
      });
    }

    let userId: number;
    let isMember = false;

    if (
      // users 테이블에 유저 정보가 이미 있는 경우(이미 회원가입 된 유저)
      userinfo.email &&
      (await UserRepository.isExistByEmail(client, userinfo.email as string))
    ) {
      userId = (
        await UserRepository.findOneByEmail(client, userinfo.email as string, [
          'userId'
        ])
      ).userId as number;
      isMember = true;
      await UserRepository.updateLatestLogin(client, userId);
    } else {
      // users 테이블에 유저 정보가 없거나 guest인 경우(회원가입)
      // Create a new ussr
      const user: UserToBeSaved = {
        email: userinfo.email ? userinfo.email : 'NULL',
        nickname: userinfo.email
          ? 'member' + String(Date.now()).slice(-8)
          : 'guest' + String(Date.now()).slice(-8),
        locale: userinfo.locale,
        roleId: userinfo.email
          ? (Role.getRoleId('member') as number)
          : (Role.getRoleId('guest') as number)
      };
      userId = Number((await UserRepository.save(client, user)).userId);
    }

    console.info(`Login \t user_id: ${userId}`);
    // jwt token 생성
    const token = jwt.sign(
      { userId, locale: userinfo.locale },
      conf.jwtToken.secretKey as string,
      userinfo.email ? conf.jwtToken.option : conf.jwtToken.optionGuest // guest면 만료 기간이 없는 토큰 생성
    );
    res.status(isMember ? 200 : 201).json({ success: true, token, isMember });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(500).json({ sucess: false, errorMessage });
  } finally {
    client.release();
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

    if (!(await UserRepository.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const updatedUser: User = await UserRepository.updateUserNickname(
      client,
      +userId,
      nickname
    );
    return res.status(200).json({
      success: true,
      user: {
        userId: updatedUser.userId,
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

    if (!(await UserRepository.isExistById(client, +userId)))
      throw new Error('userId does not exist. ');

    const deletedUser = await UserRepository.delete(client, +userId);
    return res.status(200).json({
      success: true,
      user: {
        userId: deletedUser.userId,
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
