/**
 * @description 학습 유닛 리스트 화면 구성을 위한 DTO (K-pop)
 * @version feature/api/PEAC-38-learning-list-api
 */

import Unit from '../../../../entities/unit.entity';
import { UserUnitHistory } from '../../../../entities/user-unit-history.entity.';
import Word from '../../../../entities/word.entity';

/**
 * @property contentId: number
 *
 * unitIndex: number
 *
 * thumbnailUri: string
 *
 * latestLearningAt: string
 */
export interface UnitJoinedUserUnitHistory extends Unit, UserUnitHistory {
  readonly contentId: number;
  readonly unitIndex: number;
  readonly thumbnailUri: string;
  readonly latestLearningAt: string;
}
/**
 * @property contentId: number
 *
 * unitIndex: number
 *
 * thumbnailUri: string
 *
 * latestLearningAt: string
 *
 * sentencesCounts: number
 *
 * wordsCounts: number
 *
 * words: Word[]
 */
export default interface UnitOfKpopDTO extends UnitJoinedUserUnitHistory {
  readonly sentencesCounts: number;
  readonly wordsCounts: number;
  readonly words: Word[];
}
