/**
  @description user_unit_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/

export class UserUnitHistory {
  constructor(
    readonly userId?: number,
    readonly contentId?: number,
    readonly unitIndex?: number,
    readonly counts?: number,
    readonly latestLearningAt?: string
  ) {}
}

export interface UserUnitHistoryPK extends UserUnitHistory {
  readonly userId: number;
  readonly contentId: number;
  readonly unitIndex: number;
}
