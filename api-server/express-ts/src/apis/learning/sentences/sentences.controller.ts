/* eslint-disable no-console */
/**
 @description 문장 학습을 위한 컨트롤러
 @version feature/api/testing-setup-with-jest
 */

import axios from 'axios';
import { Response, Request } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../../db';
import conf from '../../../config';
import PostSentenceToAIDTO, {
  SentenceOfPostSentenceToAIDTO
} from './dto/post-sentence-to-ai.dto';
import { MulterError } from 'multer';
import { s3Client } from '../../../utils/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { UserSentenceHistoryPK } from '../../../entities/user-sentence-history.entity';
import UserSentenceEvaluationRepository, {
  UserSentenceEvaluationToBeSaved
} from '../../../repositories/user-sentence-evaluation.repository';
import SentenceRepository from '../../../repositories/sentence.repository';
import UserSentenceHistoryRepository from '../../../repositories/user-sentence-history.repository';

const AI_SERVER_URL = `http://${conf.peachAi.ip}`;
const S3_URL = `https://s3.${conf.s3.region}.amazonaws.com`;

// /sentences/:sentenceId/userSentenceEvaluation
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const evaluateUserVoice = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');

    // 사용자 음성 파일 s3 저장
    // 사용자가 요청한 문장의 발음 평가 기록 횟수
    const sentenceEvaluationCounts =
      await UserSentenceEvaluationRepository.getSentenceEvaluationCounts(
        client,
        userId,
        +sentenceId
      );
    const FORMAT: string = req.file?.originalname.split('.')[1] || 'wav';
    const Key = `user-voice/${userId}/sentences/${sentenceId}/${sentenceEvaluationCounts}.${FORMAT}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: conf.s3.bucketData,
        Key,
        Body: req.file?.buffer
        // ACL: 'public-read'
      })
    );
    console.info('✅ Success S3 upload--------------');

    // ai server에 보낼 PostEvaluationDTO 인스턴스 생성
    const sentence: SentenceOfPostSentenceToAIDTO = {
      sentenceId: +sentenceId,
      koreanText: (
        await SentenceRepository.findOne(client, +sentenceId, ['koreanText'])
      ).koreanText as string,
      perfectVoiceUri: `${S3_URL}/${conf.s3.bucketData}/perfect-voice/sentences/${sentenceId}.wav`
    };
    const postEvaluationDTO: PostSentenceToAIDTO = {
      userId: +userId,
      userVoiceUri: `${S3_URL}/${conf.s3.bucketData}/${Key}`,
      sentence
    };
    // responsed to ai server
    let {
      // eslint-disable-next-line prefer-const
      success,
      evaluatedSentence, // eslint-disable-next-line prefer-const
      pitchData
    }: {
      success: boolean;
      evaluatedSentence: { score: number; sttResult: string };
      pitchData: {
        perfectVoice: { hz: string; time: string };
        userVoice: { hz: string; time: string };
      };
    } = (
      await axios({
        method: 'post',
        url: `${AI_SERVER_URL}/evaluation/sentence`,
        data: {
          ...postEvaluationDTO
        }
      })
    ).data;
    if (!success) throw new Error('fail to ai server rest communication');

    // 발음 평가 결과 DB 저장
    const userSentenceEvaluation: UserSentenceEvaluationToBeSaved = {
      userId,
      sentenceId: +sentenceId,
      sentenceEvaluationCounts,
      sttResult: evaluatedSentence.sttResult,
      score: evaluatedSentence.score,
      userVoiceUri: `${conf.s3.bucketDataCdn}/${Key}` // userVoiceUri for requesting to AI server
    };
    evaluatedSentence = {
      ...evaluatedSentence,
      ...(await UserSentenceEvaluationRepository.save(
        client,
        userSentenceEvaluation
      ))
    };

    await client.query('COMMIT');

    return res
      .status(201)
      .json({ success: true, evaluatedSentence, pitchData });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof MulterError) console.log('❌ MulterError ');
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// /sentences/:sentenceId/userSentenceHistory
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const recordUserSentenceHistory = async (
  req: Request,
  res: Response
) => {
  const userId: number = res.locals.userId;
  const { sentenceId } = req.params;
  const { column } = req.query;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");
    if (column !== 'perfectVoiceCounts' && column !== 'userVoiceCounts')
      throw new Error("invalid query string's syntax");

    const userSentenceHistoryPK: UserSentenceHistoryPK = {
      userId,
      sentenceId: +sentenceId
    };
    let sentenceHistory;
    // 성우 음성 재생 횟수 증가
    if (column === 'perfectVoiceCounts') {
      const perfectVoiceCounts =
        await UserSentenceHistoryRepository.updatePerfectVoiceCounts(
          client,
          userSentenceHistoryPK
        );
      sentenceHistory = {
        userId,
        sentenceId: +sentenceId,
        perfectVoiceCounts
      };
    }
    // 사용자 음성 재생 횟수 증가
    else {
      const userVoiceCounts =
        await UserSentenceHistoryRepository.updateUserVoiceCounts(
          client,
          userSentenceHistoryPK
        );
      sentenceHistory = {
        userId,
        sentenceId: +sentenceId,
        userVoiceCounts
      };
    }
    return res.status(201).json({
      success: true,
      sentenceHistory
    });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
