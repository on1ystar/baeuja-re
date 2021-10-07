/* eslint-disable no-console */
/** 
 @description learning 페이지를 위한 컨트롤러
 @version feature/api/PEAC-38-learning-list-api
 */

import { Response, Request } from 'express';
import { Content } from '../../../entities/content.entity';
import { Sentence } from '../../../entities/sentence.entity';
import { UserContentHistory } from '../../../entities/user-content-history.entity';
import { UserSentenceHistory } from '../../../entities/user-sentence-history.entity';
import { UserUnitHistory } from '../../../entities/user-unit-history.entity.';
import GetUnitsKpopDTO from './dto/get-units-K-pop.dto';
import GetUnitsOthersDTO from './dto/get-units-others.dto';
import GetUnitDTO from './dto/get-unit.dto';
import { PoolClient } from 'pg';
import { pool } from '../../../db';

// learning 첫 화면 -> 콘텐츠 리스트 화면 구성을 위한 데이터 응답
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getContents = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const client: PoolClient = await pool.connect();
  try {
    const contents = await Content.leftJoinUserContentHistory(client, userId, [
      'Content.contentId',
      'Content.classification',
      'Content.title',
      'Content.artist',
      'Content.director',
      'Content.thumbnailUri'
    ]);
    return res.status(200).json({ success: true, contents });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// learning 첫 화면 -> 콘텐츠 리스트 화면 구성을 위한 데이터 응답
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getContentDetail = async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+contentId)) throw new Error('invalid syntax of params');

    const content = await Content.findOne(client, +contentId, [
      'contentId',
      'title',
      'artist',
      'director',
      'description',
      'thumbnailUri'
    ]);
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// 콘텐츠 선택 -> 유닛 리스트 화면을 구성하기 위한 데이터 응답
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUnits = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;

  const { contentId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    // request params 유효성 검사
    if (isNaN(+contentId)) throw new Error('invalid syntax of params');

    // ----- 학습 기록 저장 -----
    const isExist = await UserContentHistory.isExist(
      client,
      userId,
      +contentId
    );
    const userContentHistory = new UserContentHistory(userId, +contentId);
    // 콘텐츠 학습 기록이 없는 경우, 콘텐츠 학습 기록 생성
    if (!isExist) await userContentHistory.create(client);
    // 콘텐츠 학습 기록이 존재하는 경우, 콘텐츠 학습 횟수 1 증가
    else userContentHistory.updateCounts(client);
    // ----- 학습 기록 저장 -----

    const content: { classification: string } = await Content.findOne(
      client,
      +contentId,
      ['classification']
    );
    // 콘텐츠가 K-POP인 경우
    if (content.classification === 'K-POP') {
      const getUnitsKpopDTOs = await GetUnitsKpopDTO.getInstances(
        userId,
        +contentId
      );

      await client.query('COMMIT');

      Promise.all(getUnitsKpopDTOs).then(units => {
        return res.status(200).json({ success: true, units });
      });
    } else {
      const getUnitsOthersDTOs = await GetUnitsOthersDTO.getInstances(
        userId,
        +contentId
      );

      await client.query('COMMIT');

      Promise.all(getUnitsOthersDTOs).then(units => {
        return res.status(200).json({ success: true, units });
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// /contents/:contentId/units/:unitIndex
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUnit = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { unitIndex, contentId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');
    // request params 유효성 검사
    if (isNaN(+unitIndex) || isNaN(+contentId))
      throw new Error('invalid syntax of params');

    // front 요청에 응답할 GetUnitDTO 인스턴스 생성
    const getUnitDTO = await GetUnitDTO.getInstance(
      userId,
      +contentId,
      +unitIndex
    );

    // ----- 학습 기록 저장 -----
    const isExist: boolean = await UserUnitHistory.isExist(
      client,
      userId,
      +contentId,
      +unitIndex
    );
    const userUnitHistory = new UserUnitHistory(userId, +contentId, +unitIndex);
    // 존재하지 않으면 유닛 및 포함된 문장 학습 기록 생성
    if (!isExist) {
      await userUnitHistory.create(client); // 유닛 학습 기록 생성
      await new UserContentHistory(userId, +contentId).updateProgressRate(
        client
      );
      // 문장 학습 기록 생성
      const sentenceIdList = (
        await Sentence.findByUnit(client, +contentId, +unitIndex, [
          'sentenceId'
        ])
      ).map(row => {
        // !(await UserSentenceHistory.isExist(client, userId, row.sentenceId))
        return row.sentenceId;
      });
      await UserSentenceHistory.createList(client, userId, sentenceIdList);
    }
    // 존재하면 학습 횟수 1 증가, 문장 최근 학습 기록 갱신
    else {
      await userUnitHistory.updateCounts(client);
      await UserSentenceHistory.updateLatestLearningAtByUnit(
        client,
        userId,
        +contentId,
        +unitIndex
      );
    }
    // ----- 학습 기록 저장 -----

    await client.query('COMMIT');

    return res.status(200).json({ success: true, ...getUnitDTO });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
