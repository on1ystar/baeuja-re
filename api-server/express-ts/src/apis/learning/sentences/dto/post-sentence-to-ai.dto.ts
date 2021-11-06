/**
  @description 발음 평가 요청을 위한 DTO
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/

export interface SentenceOfPostSentenceToAIDTO {
  readonly sentenceId: number;
  readonly koreanText: string;
}

export default interface PostSentenceToAIDTO {
  readonly userId: number;
  readonly userVoiceUri: string;
  readonly sentence: SentenceOfPostSentenceToAIDTO;
}
