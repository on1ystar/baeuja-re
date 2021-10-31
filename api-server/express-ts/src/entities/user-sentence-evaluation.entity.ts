/**
  @description user_sentence_evaluation entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/

export default class UserSentenceEvaluation {
  constructor(
    readonly userId?: number,
    readonly sentenceId?: number,
    readonly sentenceEvaluationCounts?: number,
    readonly sttResult?: string,
    readonly score?: number,
    readonly userVoiceUri?: string,
    readonly isPublic?: boolean,
    readonly createdAt?: string
  ) {}
}
