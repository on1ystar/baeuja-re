/* 
    메인(문장) 학습 페이지를 위한 컨트롤러
    version: PEAC-161 get learning unit with sentences for main learning UI
*/

import axios from 'axios';
import { Response, Request } from 'express';
import conf from '../config';
import { GetEvaluationDTO } from './dto/get-evaluation.dto';
import { GetLearningUnitDTO } from './dto/get-learning-unit.dto';

const PREFIX = 'user-voice'; // S3 bucket 폴더
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g; // 파일 경로에서 파일 이름만 필터링
const AI_SERVER_URL = `http://${conf.peachAi.ip}`;

// /learning/contents/:contentId/units/:unitIndex
export const getLearningUnit = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { unitIndex, contentId } = req.params;
  // request params 유효성 검사
  if (isNaN(parseInt(unitIndex)) || isNaN(parseInt(unitIndex))) {
    return res
      .status(400)
      .json({ success: false, errorMessage: 'invalid input syntax' });
  }
  // GetLearningUnitDTO 인스턴스 생성 후 응답
  try {
    const learningUnitDTO = await GetLearningUnitDTO.getInstance(
      userId,
      parseInt(unitIndex),
      parseInt(contentId)
    );
    return res.status(200).json(learningUnitDTO);
  } catch (error) {
    console.error(error.code);
    if (error.message === 'noData') {
      // db에 row가 없는 경우
      return res
        .status(404)
        .json({ success: false, errorMessage: error.message });
    }
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};

// /sentences/:sentenceId/units/evaluation
export const evaluateUserVoice = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { sentenceId } = req.params;
  const userVoiceUri =
    'https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/perfect-voice/test.wav';
  // request params 유효성 검사
  if (isNaN(parseInt(sentenceId))) {
    return res
      .status(400)
      .json({ success: false, errorMessage: 'invalid input syntax' });
  }
  try {
    const getEvaluationDTO = await GetEvaluationDTO.getInstance(
      userId,
      userVoiceUri,
      parseInt(sentenceId)
    );
    // request to ai server
    const respondedData = (
      await axios({
        method: 'post',
        url: `${AI_SERVER_URL}/evaluation`,
        data: {
          ...getEvaluationDTO,
          perfectVoiceUri:
            'https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/perfect-voice/test.wav'
        }
      })
    ).data;
    console.log(respondedData);
    return res.status(200).json(respondedData);
  } catch (error) {
    console.error(error.code);
    if (error.message === 'noData') {
      // db에 row가 없는 경우
      return res
        .status(404)
        .json({ success: false, errorMessage: error.message });
    }
    return res
      .status(parseInt(error.code))
      .json({ success: false, errorMessage: error.message });
  }
};
