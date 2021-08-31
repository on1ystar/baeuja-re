/* eslint-disable no-console */
/** 
 @description 학습 페이지를 위한 컨트롤러
 @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
 */

import { Response, Request } from 'express';
import GetLearningUnitDTO from './dto/get-learning-unit.dto';

// const regex = /([^/]+)(\.[^./]+)$/g; // 파일 경로에서 파일 이름만 필터링

// /learning/contents/:contentId/units/:unitIndex
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getLearningUnit = async (req: Request, res: Response) => {
  const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
  const { unitIndex, contentId } = req.params;

  try {
    // request params 유효성 검사
    if (isNaN(parseInt(unitIndex)) || isNaN(parseInt(unitIndex)))
      throw new Error("invalid params's syntax");

    // front 요청에 응답할 GetLearningUnitDTO 인스턴스 생성
    const getLearningUnitDTO = await GetLearningUnitDTO.getInstance(
      userId,
      parseInt(unitIndex),
      parseInt(contentId)
    );
    return res.status(200).json(getLearningUnitDTO);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, errorMessage: error.message });
  }
};
