export class UserWordPK {
  readonly wordId?: number;
}

export default class Word extends UserWordPK {
  constructor(
    readonly korean?: string,
    readonly translation?: string,
    readonly perfectVoiceUri?: string,
    readonly importance?: string,
    readonly createdAt?: string
  ) {
    super();
  }
}
