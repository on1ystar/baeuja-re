/* eslint-disable no-console */
/** 
 @description 문장 학습을 위한 컨트롤러
 @version feature/api/PEAC-38-learning-list-api
 */

import axios from 'axios';
import { Response, Request } from 'express';
import conf from '../../config';
import PostEvaluationDTO from './dto/post-evaluation.dto';
import UserSentenceEvaluation from '../../entities/user-sentence-evaluation.entity';
import { MulterError } from 'multer';
import { s3Client } from '../../utils/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { UserSentenceHistory } from '../../entities/user-sentence-history.entity';
import { PoolClient } from 'pg';
import { pool } from '../../db';

const AI_SERVER_URL = `http://${conf.peachAi.ip}`;
const S3_URL = `https://s3.${conf.s3.region}.amazonaws.com`;

// /sentences/:sentenceId/units/evaluation
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const evaluateUserVoice = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');

    // 사용자 음성 파일 s3 저장
    // 사용자가 요청한 문장의 발음 평가 기록 횟수
    console.time('evaluateUserVoice');
    const sentenceEvaluationCounts =
      await UserSentenceEvaluation.getSentenceEvaluationCounts(
        client,
        userId,
        +sentenceId
      );
    const Key = `user-voice/${userId}/${sentenceId}/${sentenceEvaluationCounts}.${
      req.file?.originalname.split('.')[1]
    }`;
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
    const postEvaluationDTO = await PostEvaluationDTO.getInstance(
      userId,
      `${S3_URL}/${conf.s3.bucketData}/${Key}`, // userVoiceUri for requesting to AI server
      +sentenceId
    );
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
        url: `${AI_SERVER_URL}/evaluation`,
        data: {
          ...postEvaluationDTO
        }
      })
    ).data;
    if (!success) throw new Error('fail to ai server rest communication');

    // 발음 평가 결과 DB 저장
    const userSentenceEvaluation = new UserSentenceEvaluation(
      userId,
      +sentenceId,
      sentenceEvaluationCounts,
      evaluatedSentence.sttResult,
      evaluatedSentence.score,
      `${conf.s3.bucketDataCdn}/${Key}` // userVoiceUri for requesting to AI server
    );
    evaluatedSentence = {
      ...evaluatedSentence,
      ...(await userSentenceEvaluation.create(client))
    };
    console.timeEnd('evaluateUserVoice');

    await client.query('COMMIT');

    return res
      .status(200)
      .json({ success: true, evaluatedSentence, pitchData });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof MulterError) console.log('❌ MulterError ');
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  } finally {
    client.release();
  }
};

// /sentences/:sentenceId/perfect-voice
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const recordPerfectVoiceCounts = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');

    const perfectVoiceCounts = await new UserSentenceHistory(
      userId,
      +sentenceId
    ).updateUserVoiceCounts(client);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      sentenceHistory: { userId, sentenceId: +sentenceId, perfectVoiceCounts }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  } finally {
    client.release();
  }
};

// /sentences/:sentenceId/user-voice
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const recordUserVoiceCounts = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');

    const userVoiceCounts = await new UserSentenceHistory(
      userId,
      +sentenceId
    ).updateUserVoiceCounts(client);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      sentenceHistory: { userId, sentenceId: +sentenceId, userVoiceCounts }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  } finally {
    client.release();
  }
};
