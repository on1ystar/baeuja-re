/**
 * @description 학습 유닛 리스트 화면 구성을 위한 DTO (K-DRAMA, K-MIVIE)
 * @version feature/api/PEAC-38-learning-list-api
 */

import Sentence from '../../../../entities/sentence.entity';
import UserSentenceHistory from '../../../../entities/user-sentence-history.entity';
import { UnitJoinedUserUnitHistory } from './unit-of-k-pop.dto';

/**
 * @property
 * * sentenceId: number
 * * koreanText: string
 * * translatedText: string
 * * isConversation: true
 * * isFamousLine: true
 * * learningRate: number
 * * isBookmark: true
 */
export interface SentenceJoinedUserSentenceHistory
  extends Sentence,
    UserSentenceHistory {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly isConversation: true;
  readonly isFamousLine: true;
  readonly learningRate: number;
  readonly isBookmark: true;
}

export default interface UnitOfOthersDTO extends UnitJoinedUserUnitHistory {
  readonly contentId: number;
  readonly unitIndex: number;
  readonly thumbnailUri: string;
  readonly latestLearningAt: string;
  readonly sentence: SentenceJoinedUserSentenceHistory; // 대표 문장
}
