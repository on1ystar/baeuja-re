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
  const { userId, timezone } = res.locals;
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');
    await client.query(`SET TIME ZONE '${timezone}'`);

    // 사용자 음성 파일 s3 저장
    // 사용자가 요청한 문장의 발음 평가 기록 횟수 (다음 기록되야 할 횟수)
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

    const koreanText = (
      (await SentenceRepository.findOne(client, +sentenceId, ['koreanText']))
        .koreanText as string
    )
      .replace(/[\'\"\)`!?.,\(a-zA-Z]/g, '')
      .trim();
    // ai server에 보낼 PostEvaluationDTO 인스턴스 생성
    const sentence: SentenceOfPostSentenceToAIDTO = {
      sentenceId: +sentenceId,
      koreanText
    };
    const postEvaluationDTO: PostSentenceToAIDTO = {
      userId: +userId,
      userVoiceUri: `${S3_URL}/${conf.s3.bucketData}/${Key}`,
      sentence
    };
    // ----------------------responsed to ai server-----------------------------
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

    // score 반올림
    evaluatedSentence.score = Math.round(evaluatedSentence.score);

    // 소수점 6째 자리 이하 반올림
    if (pitchData.perfectVoice.hz.length !== 0) {
      const perfectVoiceHz = JSON.parse(pitchData.perfectVoice.hz).map(
        (t: number) => Math.round(t * 10 * 6) / (10 * 6)
      );
      const userVoiceHz = JSON.parse(pitchData.userVoice.hz).map(
        (t: number) => Math.round(t * 10 * 6) / (10 * 6)
      );
      pitchData.perfectVoice.hz = JSON.stringify(perfectVoiceHz);
      pitchData.userVoice.hz = JSON.stringify(userVoiceHz);
    }

    // 소수점 2째 자리 이하 반올림
    if (pitchData.perfectVoice.time.length !== 0) {
      const perfectVoiceTime = JSON.parse(pitchData.perfectVoice.time).map(
        (t: number) => Math.round(t * 100) / 100
      );
      const userVoiceTime = JSON.parse(pitchData.userVoice.time).map(
        (t: number) => Math.round(t * 100) / 100
      );
      pitchData.perfectVoice.time = JSON.stringify(perfectVoiceTime);
      pitchData.userVoice.time = JSON.stringify(userVoiceTime);
    }

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
      correctText: koreanText,
      ...evaluatedSentence,
      ...(await UserSentenceEvaluationRepository.save(
        client,
        userSentenceEvaluation
      ))
    };

    // 발화 평균 점수 및 가장 높은 점수 업데이트
    let { averageScore, highestScore } =
      await UserSentenceHistoryRepository.findOne(
        client,
        { userId, sentenceId: +sentenceId },
        ['averageScore', 'highestScore']
      );
    averageScore =
      averageScore === null
        ? evaluatedSentence.score
        : Math.round((Number(averageScore) + evaluatedSentence.score) / 2);
    highestScore =
      Number(highestScore) < evaluatedSentence.score
        ? evaluatedSentence.score
        : Number(highestScore);
    await UserSentenceHistoryRepository.updateScore(
      client,
      {
        userId,
        sentenceId: +sentenceId
      },
      averageScore,
      highestScore
    );

    await client.query('COMMIT');

    return res
      .status(201)
      .json({ success: true, evaluatedSentence, pitchData });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof MulterError) console.log('❌ MulterError ');
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
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
  const { userId, timezone } = res.locals;
  const { sentenceId } = req.params;
  const { column } = req.query;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");
    if (column !== 'perfectVoiceCounts' && column !== 'userVoiceCounts')
      throw new Error("invalid query string's syntax");

    await client.query(`SET TIME ZONE '${timezone}'`);

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
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
