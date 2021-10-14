import Content from '../../../entities/content.entity';

export default interface NewContentsDTO extends Content {
  readonly contentId: number;
  readonly title: string;
  readonly artist: string;
  readonly director: string;
  readonly thumbnailUri: string;
  readonly countsOfUnits: number;
  readonly countsOfSentences: number;
  readonly countsOfwords: number;
  readonly updatedAt: string;
}
