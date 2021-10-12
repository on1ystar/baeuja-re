import Sentence from '../../../../entities/sentence.entity';
import UserSentenceHistory from '../../../../entities/user-sentence-history.entity';
import Word from '../../../../entities/word.entity';

export interface WordOfLearningSentenceDTO extends Word {
  readonly wordId: number;
  readonly sentenceId: number;
  readonly prevKoreanText: string;
  readonly prevTranslatedText: string;
  readonly originalKoreanText: string;
  readonly originalTranslatedText: string;
}

export interface SentenceOfLearningSentenceDTO
  extends Sentence,
    UserSentenceHistory {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly perfectVoiceUri: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly isBookmark: boolean;
}

export default interface LearningSentenceDTO extends Sentence {
  readonly words: WordOfLearningSentenceDTO[];
}
