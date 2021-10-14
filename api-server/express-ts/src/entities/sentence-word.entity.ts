export default class SentenceWord {
  constructor(
    readonly sentenceId?: number,
    readonly wordId?: number,
    readonly koreanInText?: string,
    readonly translationInText?: string,
    readonly createdAt?: string
  ) {}
}
