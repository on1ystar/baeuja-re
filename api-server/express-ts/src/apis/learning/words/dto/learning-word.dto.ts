import UserWordHistory from '../../../../entities/user-word-history.entity';
import Word from '../../../../entities/word.entity';

/**
 * @property
 ** wordId: number
 ** korean: string
 ** translation: string
 ** perfectVoiceUri: string
 ** importance: string
 ** isBookmark: boolean
 */
export default interface LearningWordDTO extends Word, UserWordHistory {
  readonly wordId: number;
  readonly korean: string;
  readonly translation: string;
  readonly perfectVoiceUri: string;
  readonly importance: string;
  readonly isBookmark: boolean;
}
