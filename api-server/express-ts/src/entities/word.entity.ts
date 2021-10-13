export default class Word {
  constructor(
    readonly wordId?: number,
    readonly korean?: string,
    readonly translation?: string,
    readonly perfectVoiceUri?: string,
    readonly importance?: string,
    readonly createdAt?: string
  ) {}
}
