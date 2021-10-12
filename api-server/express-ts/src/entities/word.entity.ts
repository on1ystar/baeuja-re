export default class Word {
  constructor(
    readonly wordId?: number,
    readonly sentenceId?: number,
    readonly prevKoreanText?: string,
    readonly prevTranslatedText?: string,
    readonly originalKoreanText?: string,
    readonly originalTranslatedText?: string,
    readonly perfectVoiceUri?: string,
    readonly importance?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}
}
