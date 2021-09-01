export class Unit {
  constructor(
    readonly unitIndex: number,
    readonly contentId: number,
    readonly youtubeUrl?: string,
    readonly startTime?: string,
    readonly endTime?: string,
    readonly thumbnailUri?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}
}
