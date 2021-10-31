export default class UserWordEvaluation {
  constructor(
    readonly userId?: number,
    readonly wordId?: number,
    readonly wordEvaluationCounts?: number,
    readonly sttResult?: string,
    readonly score?: number,
    readonly userVoiceUri?: string,
    readonly createdAt?: string
  ) {}
}
