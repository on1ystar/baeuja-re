import Sentence from '../../../entities/sentence.entity';
import Unit from '../../../entities/unit.entity';
import Word from '../../../entities/word.entity';

export interface SentenceOfRecommendationsOfWordDTO extends Sentence, Unit {
  readonly sentenceId: number;
  readonly contentId: number;
  readonly unitIndex: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly koreanInText: string;
  readonly translationInText: string;
  readonly startTime: string;
  readonly thumbnailUri: string;
}

export default interface RecommendationsOfWordDTO extends Word {
  readonly wordId: number;
  readonly korean: string;
  readonly translation: string;
  readonly importance: string;
  readonly sentences: SentenceOfRecommendationsOfWordDTO[];
}
