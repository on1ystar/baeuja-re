/* eslint-disable no-console */
/** 
 @description learning 페이지를 위한 컨트롤러
 @version feature/api/PEAC-38-learning-list-api
 */

import { Response, Request } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../../db';
import Content from '../../../entities/content.entity';
import { UserContentHistoryPK } from '../../../entities/user-content-history.entity';
import { UserUnitHistoryPK } from '../../../entities/user-unit-history.entity.';
import Unit from '../../../entities/unit.entity';
import LearningContentDTO from './dto/learning-content.dto';
import ContentRepository from '../../../repositories/content.repository';
import UserContentHistoryRepository from '../../../repositories/user-content-history.repository';
import UnitRepository from '../../../repositories/unit.repository';
import SentenceRepository from '../../../repositories/sentence.repository';
import UserUnitHistoryRepository from '../../../repositories/user-unit-history.repository';
import UserSentenceHistoryRepository from '../../../repositories/user-sentence-history.repository';
import LearningSentenceDTO, {
  SentenceOfLearningSentenceDTO,
  WordOfLearningSentenceDTO
} from './dto/learning-sentences.dto';

// GET /contents
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getContents = async (_req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const client: PoolClient = await pool.connect();
  try {
    const contents: LearningContentDTO[] =
      await ContentRepository.leftJoinUserContentHistory(client, userId, [
        {
          Content: [
            'contentId',
            'classification',
            'title',
            'artist',
            'director',
            'thumbnailUri'
          ]
        },
        {
          UserContentHistory: ['progressRate']
        }
      ]);
    return res.status(200).json({ success: true, contents });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /contents/:contentId
export const getContentDetail = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { contentId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // reqeust params 유효성 검사
    if (isNaN(+contentId)) throw new Error('invalid syntax of params');

    const content: Content = await ContentRepository.findOne(
      client,
      +contentId,
      [
        'contentId',
        'title',
        'artist',
        'director',
        'description',
        'thumbnailUri',
        'youtubeUrl'
      ]
    );
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;

    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /contents/:contentId/units
export const getUnits = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { userId, timezone } = res.locals;

  const { contentId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (isNaN(+contentId)) throw new Error('invalid syntax of params');

    await client.query('BEGIN');
    await client.query(`SET TIME ZONE '${timezone}'`);

    // ----- 학습 기록 저장 -----
    const userContentHistoryPK: UserContentHistoryPK = {
      userId,
      contentId: +contentId
    };
    const isExist = await UserContentHistoryRepository.isExist(
      client,
      userContentHistoryPK
    );
    // // 콘텐츠 학습 기록이 없는 경우, 콘텐츠 학습 기록 생성
    if (!isExist)
      await UserContentHistoryRepository.save(client, {
        ...userContentHistoryPK
      });
    // 콘텐츠 학습 기록이 존재하는 경우, 콘텐츠 학습 횟수 1 증가
    else
      UserContentHistoryRepository.updateCounts(client, userContentHistoryPK);

    await client.query(`SET TIMEZONE='UTC'`);

    // 학습 유닛 리스트
    let units: any[] = await UnitRepository.leftJoinUserUnitHistory(
      client,
      userId,
      +contentId,
      [
        { Unit: ['contentId', 'unitIndex', 'thumbnailUri'] },
        { UserUnitHistory: ['counts', 'latestLearningAt'] }
      ]
    );
    // 학습 유닛 별 학습 문장 개수 리스트
    const sentencesCountsObjects: any[] =
      await UnitRepository.getSentencesCounts(client, +contentId);
    // 학습 유닛 별 학습 단어 개수 리스트
    const wordsCountsObjects: any[] = await UnitRepository.getWordsCounts(
      client,
      +contentId
    );
    // 학습 유닛 별 회화 표현 개수 리스트
    const isConversationsCountsObjects: any[] =
      await UnitRepository.getIsConversations(client, +contentId);
    // 학습 유닛 별 명대사 개수 리스트
    const isFamousLinesCountsObjects: any[] =
      await UnitRepository.getIsFamousLines(client, +contentId);
    units = units.map((unit, index) => {
      return {
        ...unit,
        sentencesCounts: +sentencesCountsObjects[index].count,
        wordsCounts: +wordsCountsObjects[index].count,
        isConversationsCounts: +isConversationsCountsObjects[index].count,
        isFamousLinesCounts: +isFamousLinesCountsObjects[index].count
      };
    });

    await client.query('COMMIT');

    return res.status(200).json({ success: true, units });
  } catch (error) {
    await client.query('ROLLBACK');
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /contents/:contentId/units/:unitIndex
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUnit = async (req: Request, res: Response) => {
  const { userId, timezone } = res.locals;
  const { unitIndex, contentId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+unitIndex) || isNaN(+contentId))
      throw new Error('invalid syntax of params');

    await client.query('BEGIN');
    await client.query(`SET TIME ZONE '${timezone}'`);

    // front 요청에 응답할 unit 인스턴스 생성
    const unit: Unit = await UnitRepository.findOne(
      client,
      +contentId,
      +unitIndex,
      ['unitIndex', 'contentId', 'youtubeUrl', 'startTime', 'endTime']
    );

    // ----- 학습 기록 저장 -----
    const userUnitHistoryPK: UserUnitHistoryPK = {
      userId,
      contentId: +contentId,
      unitIndex: +unitIndex
    };
    const isExist: boolean = await UserUnitHistoryRepository.isExist(
      client,
      userUnitHistoryPK
    );
    // 존재하지 않으면 유닛 학습 기록 생성
    if (!isExist) {
      await UserUnitHistoryRepository.save(client, userUnitHistoryPK); // 유닛 학습 기록 생성
      await UserContentHistoryRepository.updateProgressRate(client, {
        userId,
        contentId: +contentId
      });
    }
    // // 존재하면 학습 횟수 1 증가
    else
      await UserUnitHistoryRepository.updateCounts(client, userUnitHistoryPK);

    // ----- 학습 기록 저장 -----
    await client.query('COMMIT');
    return res.status(200).json({ success: true, unit });
  } catch (error) {
    await client.query('ROLLBACK');
    console.warn(error);
    const errorMessage = (error as Error).message;

    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /contents/:contentId/units/:unitIndex/sentences
export const getSentences = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId, timezone } = res.locals;
  const { unitIndex, contentId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+unitIndex) || isNaN(+contentId))
      throw new Error('invalid syntax of params');

    await client.query(`SET TIME ZONE '${timezone}'`);

    // front 요청에 응답할 sentences 조회
    const sentences: SentenceOfLearningSentenceDTO[] =
      await SentenceRepository.leftJoinUserSentenceHistory(
        client,
        userId,
        +contentId,
        +unitIndex,
        [
          {
            Sentence: [
              'sentenceId',
              'koreanText',
              'translatedText',
              'perfectVoiceUri',
              'isConversation',
              'isFamousLine',
              'startTime',
              'endTime'
            ]
          },
          {
            UserSentenceHistory: ['isBookmark']
          }
        ]
      );
    const words: WordOfLearningSentenceDTO[] =
      await SentenceRepository.joinWord(client, +contentId, +unitIndex, [
        {
          Word: ['wordId', 'korean', 'translation']
        },
        {
          SentenceWord: ['sentenceId', 'koreanInText', 'translationInText']
        }
      ]);
    const LearningSentenceDTOs: LearningSentenceDTO[] = sentences.map(
      sentence => {
        return {
          ...sentence,
          words: words.filter(word => word.sentenceId === sentence.sentenceId)
        };
      }
    );
    // 문장 학습 기록이 없는 경우 새로 생성
    if (
      !(await UserSentenceHistoryRepository.isExist(client, {
        userId,
        sentenceId: sentences[0].sentenceId
      }))
    ) {
      // 문장 학습 기록 생성
      const sentenceIdList: number[] = sentences.map(
        sentence => sentence.sentenceId
      );
      await UserSentenceHistoryRepository.createList(
        client,
        userId,
        sentenceIdList
      );
    } else {
      // 문장 최근 학습 날짜 갱신
      await UserSentenceHistoryRepository.updateLatestLearningAtByUnit(
        client,
        userId,
        { unitIndex: +unitIndex, contentId: +contentId }
      );
    }
    return res
      .status(200)
      .json({ success: true, sentences: LearningSentenceDTOs });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;

    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
