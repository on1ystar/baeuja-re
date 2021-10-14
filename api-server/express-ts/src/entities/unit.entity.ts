/**
  @version feature/api/api-route-refactoring
*/

export class UnitPK {
  readonly unitIndex?: number;

  readonly contentId?: number;
}

export default class Unit extends UnitPK {
  constructor(
    readonly youtubeUrl?: string,
    readonly startTime?: string,
    readonly endTime?: string,
    readonly thumbnailUri?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {
    super();
  }
}
