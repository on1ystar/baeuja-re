/**
  @version feature/api/PEAC-38-learning-list-api
*/

export default class Sentence {
  constructor(
    readonly sentenceId?: number,
    readonly unitIndex?: number,
    readonly contentsId?: number,
    readonly koreanText?: string,
    readonly translatedText?: string,
    readonly perfectVoiceUri?: string,
    readonly isConversation?: boolean,
    readonly isFamousLine?: boolean,
    readonly startTime?: string,
    readonly endTime?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}
}
