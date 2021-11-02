/** 
 @description user 컨트롤러
 @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
 */

import e, { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import User from '../../entities/user.entity';
import jwt from 'jsonwebtoken';
import Role from '../../entities/role.entity';
import conf from '../../config';
import UserRepository, {
  UserToBeSaved
} from '../../repositories/user.repository';
import UserContentHistoryRepository from '../../repositories/user-content-history.repository';
import UserUnitHistoryRepository from '../../repositories/user-unit-history.repository';
import UserSentenceHistoryRepository from '../../repositories/user-sentence-history.repository';
import UserWordHistoryRepository from '../../repositories/user-word-history.repository';
import UserSentenceEvaluationRepository from '../../repositories/user-sentence-evaluation.repository';
import UserWordEvaluationRepository from '../../repositories/user-word-evaluation.repository';

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
  const { userId, timezone } = res.locals;
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
      'country',
      'timezone',
      'createdAt',
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
  // platform, country, timezone
  const { userinfo } = req.body;
  const client: PoolClient = await pool.connect();

  try {
    if (
      (userinfo.platform === undefined,
      userinfo.country === undefined,
      userinfo.timezone === undefined)
    ) {
      return res.status(400).json({
        success: false,
        errorMessage:
          'Require platform && country && timezone properties in Request Body { userinfo }'
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
        platform: userinfo.platform,
        country: userinfo.country,
        timezone: userinfo.timezone,
        roleId: userinfo.email
          ? (Role.getRoleId('member') as number)
          : (Role.getRoleId('guest') as number)
      };
      userId = Number((await UserRepository.save(client, user)).userId);
    }

    // jwt token 생성
    const token = jwt.sign(
      { userId, timezone: userinfo.timezone }, // payload: {userId, timezone}
      conf.jwtToken.secretKey as string, // secretOrPrivateKey
      userinfo.email ? conf.jwtToken.option : conf.jwtToken.optionGuest // options: guest면 만료 기간이 없는 토큰 생성
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
export const patchtUser = async (req: Request, res: Response) => {
  const { userId, timezone } = res.locals;
  const { column } = req.query; // email | nickname | country | timezone
  const { updatingValue } = req.body;
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
    if (typeof column === 'undefined' || typeof updatingValue === 'undefined')
      throw new Error('invalid syntax of request');

    if (
      column === 'email' &&
      (await UserRepository.isExistByEmail(client, updatingValue))
    )
      throw new Error('already exists');
    if (
      column === 'nickname' &&
      (await UserRepository.isExistByNickname(client, updatingValue))
    )
      throw new Error('already exists');

    const user: User = await UserRepository.update(
      client,
      +userId,
      column as string,
      updatingValue
    );
    let token;
    if (column === 'email' || column === 'timezone') {
      token = jwt.sign(
        {
          userId,
          tiemzone: String(column) === 'timezone' ? updatingValue : timezone
        }, // payload: {userId, timezone}
        conf.jwtToken.secretKey as string, // secretOrPrivateKey
        user.roleId === 2 ? conf.jwtToken.option : conf.jwtToken.optionGuest // options: guest면 만료 기간이 없는 토큰 생성
      );
    }
    return res.status(200).json({
      success: true,
      user,
      token
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
  const { userId, timezone } = res.locals;
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

// GET /users/{userId}/learning-history
export const getLearningHistory = async (req: Request, res: Response) => {
  const { userId, timezone } = res.locals;
  const client: PoolClient = await pool.connect();
  try {
    const learningHistory = {
      countsOfContents: await UserContentHistoryRepository.getUserHistoryCounts(
        client,
        userId
      ),
      countsOfUnits: await UserUnitHistoryRepository.getUserHistoryCounts(
        client,
        userId
      ),
      countsOfSentences:
        await UserSentenceHistoryRepository.getUserHistoryCounts(
          client,
          userId
        ),
      countsOfWords: await UserWordHistoryRepository.getUserHistoryCounts(
        client,
        userId
      ),
      // 소수점 2째자리에서 반올림
      avarageScoreOfSentences:
        Math.round(
          (await UserSentenceEvaluationRepository.getAvarageScore(
            client,
            userId
          )) *
            10 *
            2
        ) /
        (10 * 2),
      // 소수점 2째자리에서 반올림
      avarageScoreOfWords:
        Math.round(
          (await UserWordEvaluationRepository.getAvarageScore(client, userId)) *
            10 *
            2
        ) /
        (10 * 2)
    };
    return res.status(200).json({ success: true, learningHistory });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
