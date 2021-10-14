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
import Word from '../../../entities/word.entity';
import Unit from '../../../entities/unit.entity';
import UnitOfKpopDTO, {
  UnitJoinedUserUnitHistory
} from './dto/unit-of-k-pop.dto';
import UnitOfOthersDTO, {
  SentenceJoinedUserSentenceHistory
} from './dto/unit-of-others.dto';
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

// /contents
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
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// /contents/:contentId
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
        'thumbnailUri'
      ]
    );
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// /contents/:contentId/units
export const getUnits = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const userId: number = res.locals.userId;

  const { contentId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    // request params 유효성 검사
    if (isNaN(+contentId)) throw new Error('invalid syntax of params');

    // ----- 학습 기록 저장 -----
    const userContentHistoryPK: UserContentHistoryPK = {
      userId,
      contentId: +contentId
    };
    const isExist = await UserContentHistoryRepository.isExist(
      client,
      userContentHistoryPK
    );
    // 콘텐츠 학습 기록이 없는 경우, 콘텐츠 학습 기록 생성
    if (!isExist)
      await UserContentHistoryRepository.save(client, {
        ...userContentHistoryPK
      });
    // 콘텐츠 학습 기록이 존재하는 경우, 콘텐츠 학습 횟수 1 증가
    else
      UserContentHistoryRepository.updateCounts(client, userContentHistoryPK);
    // ----- 학습 기록 저장 -----

    const content: Content = await ContentRepository.findOne(
      client,
      +contentId,
      ['classification']
    );
    // 콘텐츠가 K-POP인 경우
    if (content.classification?.toUpperCase() === 'K-POP') {
      const units: UnitJoinedUserUnitHistory[] =
        await UnitRepository.leftJoinUserUnitHistory(
          client,
          userId,
          +contentId,
          [
            { Unit: ['contentId', 'unitIndex', 'thumbnailUri'] },
            { UserUnitHistory: ['latestLearningAt'] }
          ]
        );
      const unitOfKpopDTOs: Promise<UnitOfKpopDTO>[] = units.map(async unit => {
        const sentencesCounts: number = (
          await SentenceRepository.findAllByUnit(
            client,
            { contentId: unit.contentId, unitIndex: unit.unitIndex },
            ['sentenceId']
          )
        ).length;
        const words: Word[] = await SentenceRepository.joinWord(
          client,
          unit.contentId,
          unit.unitIndex,
          [{ Word: ['wordId', 'korean'] }]
        );
        const wordsCounts: number = words.length;
        return {
          ...unit,
          sentencesCounts,
          wordsCounts,
          words
        };
      });

      await client.query('COMMIT');

      Promise.all(unitOfKpopDTOs).then((unitsOfKpop: UnitOfKpopDTO[]) => {
        return res.status(200).json({ success: true, units: unitsOfKpop });
      });
    } else {
      const units = await UnitRepository.leftJoinUserUnitHistory(
        client,
        userId,
        +contentId,
        [
          { Unit: ['contentId', 'unitIndex', 'thumbnailUri'] },
          { UserUnitHistory: ['latestLearningAt'] }
        ]
      );
      const unitOfOthersDTOs: Promise<UnitOfOthersDTO>[] = units.map(
        async unit => {
          const sentence: SentenceJoinedUserSentenceHistory = (
            await SentenceRepository.leftJoinUserSentenceHistory(
              client,
              userId,
              +contentId,
              unit.unitIndex,
              [
                {
                  Sentence: [
                    'sentenceId',
                    'koreanText',
                    'translatedText',
                    'isConversation',
                    'isFamousLine'
                  ]
                },
                { UserSentenceHistory: ['learningRate'] }
              ]
            )
          )[0];

          return {
            ...unit,
            sentence
          };
        }
      );

      await client.query('COMMIT');

      Promise.all(unitOfOthersDTOs).then((unitsOfOthers: UnitOfOthersDTO[]) => {
        return res.status(200).json({ success: true, units: unitsOfOthers });
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.warn(error);
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
    // 존재하지 않으면 유닛 및 포함된 문장 학습 기록 생성
    if (!isExist) {
      await UserUnitHistoryRepository.save(client, userUnitHistoryPK); // 유닛 학습 기록 생성
      await UserContentHistoryRepository.updateProgressRate(client, {
        userId,
        contentId: +contentId
      });

      // 문장 학습 기록 생성
      const sentenceIdList = (
        await SentenceRepository.findAllByUnit(
          client,
          { contentId: +contentId, unitIndex: +unitIndex },
          ['sentenceId']
        )
      ).map(row => {
        // !(await UserSentenceHistory.isExist(client, userId, row.sentenceId))
        return row.sentenceId;
      });
      await UserSentenceHistoryRepository.createList(
        client,
        userId,
        sentenceIdList
      );
    }
    // 존재하면 학습 횟수 1 증가, 문장 최근 학습 기록 갱신
    else {
      await UserUnitHistoryRepository.updateCounts(client, userUnitHistoryPK);
      await UserSentenceHistoryRepository.updateLatestLearningAtByUnit(
        client,
        userId,
        { unitIndex: +unitIndex, contentId: +contentId }
      );
    }
    // ----- 학습 기록 저장 -----
    await client.query('COMMIT');
    return res.status(200).json({ success: true, unit });
  } catch (error) {
    await client.query('ROLLBACK');
    console.warn(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// /contents/:contentId/units/:unitIndex/sentences
export const getSentences = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userId: number = res.locals.userId;
  const { unitIndex, contentId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+unitIndex) || isNaN(+contentId))
      throw new Error('invalid syntax of params');
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

    return res
      .status(200)
      .json({ success: true, sentences: LearningSentenceDTOs });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;

    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
