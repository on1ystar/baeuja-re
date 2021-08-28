/* 
    메인(문장) 학습 페이지를 위한 컨트롤러
*/

import { Response, Request } from 'express';
import { GetLearningUnitDTO } from './dto/get-learning-unit.dto';

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
      .status(parseInt(error.code))
      .json({ success: false, errorMessage: error.message });
  }
};
