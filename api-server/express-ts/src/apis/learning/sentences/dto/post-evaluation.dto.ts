/**
  @description 발음 평가 요청을 위한 DTO
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/

import Sentence from '../../../../entities/sentence.entity';

export interface SentenceOfPostEvaluationDTO extends Sentence {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly perfectVoiceUri: string;
}

export default interface PostEvaluationDTO {
  readonly userId: number;
  readonly userVoiceUri: string;
  readonly sentence: SentenceOfPostEvaluationDTO;
}
