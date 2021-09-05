/**
  @version feature/api/PEAC-38-learning-list-api
*/

export class Content {
  constructor(
    readonly contentId: number,
    readonly classification: string,
    readonly title: string,
    readonly description: string,
    readonly youtubeUrl: string,
    readonly thumbnailUri: string,
    readonly artist?: string,
    readonly director?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}
}
