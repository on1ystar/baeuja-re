/**
  @description 발음 평가 요청을 위한 DTO
  @version feature/api/PEAC-202-words-api
*/

export interface WordOfPostWordToAIDTO {
  readonly wordId: number;
  readonly korean: string;
  readonly perfectVoiceUri: string;
}

export default interface PostWordToAIDTO {
  readonly userId: number;
  readonly userVoiceUri: string;
  readonly word: WordOfPostWordToAIDTO;
}
