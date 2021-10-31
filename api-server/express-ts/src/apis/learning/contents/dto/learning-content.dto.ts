import Content from '../../../../entities/content.entity';
import UserContentHistory from '../../../../entities/user-content-history.entity';

export default interface LearningContentDTO
  extends Content,
    UserContentHistory {
  readonly contentId: number;
  readonly classification: string;
  readonly title: string;
  readonly thumbnailUri: string;
  readonly artist: string;
  readonly director: string;
  readonly progressRate: number;
}
