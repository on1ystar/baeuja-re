/* eslint-disable no-console */
/** 
 @description 문장 학습을 위한 컨트롤러
 @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
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

// const regex = /([^/]+)(\.[^./]+)$/g; // 파일 경로에서 파일 이름만 필터링
const FORMAT = 'wav';
const AI_SERVER_URL = `http://${conf.peachAi.ip}`;

// /sentences/:sentenceId/units/evaluation
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const evaluateUserVoice = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(parseInt(sentenceId))) throw new Error("invalid params's syntax");

    // 사용자 음성 파일 s3 저장
    // 사용자가 요청한 문장의 발음 평가 기록 횟수
    const sentenceEvaluationCounts =
      await UserSentenceEvaluation.getSentenceEvaluationCounts(
        userId,
        parseInt(sentenceId)
      );
    const Key = `user-voice/${userId}/${sentenceId}/${sentenceEvaluationCounts}.${FORMAT}`;
    const userVoiceUri = `https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/${Key}`;
    // const userVoiceUri = `https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/perfect-voice/words/가려지다.wav`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: conf.bucket.data,
        Key,
        Body: req.file?.buffer
        // ACL: 'public-read'
      })
    );
    console.info('Success S3 upload--------------');

    // ai server에 보낼 PostEvaluationDTO 인스턴스 생성
    const postEvaluationDTO = await PostEvaluationDTO.getInstance(
      userId,
      userVoiceUri,
      parseInt(sentenceId)
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
    if (!success)
      throw new Error('Error : fail to ai server rest communication');

    // 발음 평가 결과 DB 저장
    const userSentenceEvaluation = new UserSentenceEvaluation(
      userId,
      parseInt(sentenceId),
      evaluatedSentence.score,
      evaluatedSentence.sttResult,
      userVoiceUri
    );
    // await userSentenceEvaluation.insert(); // 테스트 후 지워야 함
    evaluatedSentence = {
      ...evaluatedSentence,
      ...(await userSentenceEvaluation.create())
    };

    return res
      .status(200)
      .json({ success: true, evaluatedSentence, pitchData });
  } catch (error) {
    if (error instanceof MulterError) console.log('MulterError ');
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};

// /sentences/:sentenceId/perfect-voice
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const recordPerfectVoiceCounts = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(parseInt(sentenceId))) throw new Error("invalid params's syntax");

    const perfectVoiceCounts = await new UserSentenceHistory(
      userId,
      parseInt(sentenceId)
    ).updatePerfectVoiceCounts();

    return res.status(200).json({
      success: true,
      sentenceHistory: { userId, sentenceId, perfectVoiceCounts }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};

// /sentences/:sentenceId/user-voice
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const recordUserVoiceCounts = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(parseInt(sentenceId))) throw new Error("invalid params's syntax");
    const userVoiceCounts = await new UserSentenceHistory(
      userId,
      parseInt(sentenceId)
    ).updateUserVoiceCounts();

    return res.status(200).json({
      success: true,
      sentenceHistory: { userId, sentenceId, userVoiceCounts }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};
