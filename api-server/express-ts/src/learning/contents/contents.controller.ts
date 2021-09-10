/* eslint-disable no-console */
/** 
 @description 학습 페이지를 위한 컨트롤러
 @version feature/api/PEAC-38-learning-list-api
 */

import { Response, Request } from 'express';
import { Content } from '../../entities/content.entity';
import { Sentence } from '../../entities/sentence.entity';
import { UserContentHistory } from '../../entities/user-content-history.entity';
import { UserSentenceHistory } from '../../entities/user-sentence-history.entity';
import { UserUnitHistory } from '../../entities/user-unit-history.entity.';
import GetUnitListKPOPDTO from './dto/get-unit-list-K-POP.dto';
import GetUnitListOthersDTO from './dto/get-unit-list-others.dto';
import GetUnitDTO from './dto/get-unit.dto';

// 콘텐츠 선택 -> 유닛 리스트 화면을 구성하기 위한 데이터 응답
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUnitList = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7));
  const { contentId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(+contentId) || isNaN(userId))
      throw new Error('invalid syntax of params or access token');

    const isExist = await UserContentHistory.isExist(userId, +contentId);
    const userContentHistory = new UserContentHistory(userId, +contentId);
    // 콘텐츠 학습 기록이 없는 경우, 콘텐츠 학습 기록 생성
    if (!isExist) await userContentHistory.create();
    // 콘텐츠 학습 기록이 존재하는 경우, 콘텐츠 학습 횟수 1 증가
    else userContentHistory.updateCounts();

    const content: { classification: string } = await Content.findOne(
      +contentId,
      'classification'
    );
    // 콘텐츠가 K-POP인 경우
    if (content.classification === 'K-POP') {
      const getUnitListKPOPDTO = await GetUnitListKPOPDTO.getInstance(
        userId,
        +contentId
      );
      Promise.all(getUnitListKPOPDTO).then(unitList => {
        return res.status(200).json({ success: true, unitList });
      });
    } else {
      const getUnitListOthersDTO = await GetUnitListOthersDTO.getInstance(
        userId,
        +contentId
      );
      Promise.all(getUnitListOthersDTO).then(unitList => {
        return res.status(200).json({ success: true, unitList });
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};

// 유닛 선택 -> 유닛 학습 화면을 구성하기 위한 데이터 응답
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUnit = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { unitIndex, contentId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(+unitIndex) || isNaN(+contentId) || isNaN(userId))
      throw new Error('invalid syntax of params or access token');

    // front 요청에 응답할 GetUnitDTO 인스턴스 생성
    const getUnitDTO = await GetUnitDTO.getInstance(
      userId,
      +contentId,
      +unitIndex
    );

    const isExist: boolean = await UserUnitHistory.isExist(
      userId,
      +contentId,
      +unitIndex
    );
    const userUnitHistory = new UserUnitHistory(userId, +contentId, +unitIndex);
    // 존재하지 않으면 유닛 및 포함된 문장 학습 기록 생성
    if (!isExist) {
      await userUnitHistory.create(); // 유닛 학습 기록 생성

      const sentenceIdList = (
        await Sentence.findByUnit(+contentId, +unitIndex, 'sentenceId')
      ).map(row => row.sentenceId);
      await UserSentenceHistory.createList(userId, sentenceIdList); // 문장 학습 기록 생성
    }
    // 존재하면 학습 횟수 1 증가
    else await userUnitHistory.updateCounts();

    return res.status(200).json(getUnitDTO);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};
