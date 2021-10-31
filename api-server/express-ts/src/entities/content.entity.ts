/**
  @version feature/api/api-route-refactoring
*/

export class ContentPK {
  readonly contentId?: number;
}

export default class Content extends ContentPK {
  constructor(
    readonly classification?: string,
    readonly title?: string,
    readonly description?: string,
    readonly youtubeUrl?: string,
    readonly thumbnailUri?: string,
    readonly artist?: string,
    readonly director?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {
    super();
  }
}
