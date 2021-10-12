/**
  @version feature/api/api-route-refactoring
*/

export default class Unit {
  constructor(
    readonly unitIndex?: number,
    readonly contentId?: number,
    readonly youtubeUrl?: string,
    readonly startTime?: string,
    readonly endTime?: string,
    readonly thumbnailUri?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}
}

/**
 * @property unitIndex: number
 * @property contentId: number
 */
export interface UnitPK extends Unit {
  readonly unitIndex: number;
  readonly contentId: number;
}
