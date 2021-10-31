/**
  @description user_unit_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/

export class UserUnitHistoryPK {
  readonly userId?: number;

  readonly contentId?: number;

  readonly unitIndex?: number;
}

export class UserUnitHistory extends UserUnitHistoryPK {
  constructor(readonly counts?: number, readonly latestLearningAt?: string) {
    super();
  }
}
