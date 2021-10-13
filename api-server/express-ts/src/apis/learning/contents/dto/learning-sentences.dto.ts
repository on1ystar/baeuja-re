import Sentence from '../../../../entities/sentence.entity';
import UserSentenceHistory from '../../../../entities/user-sentence-history.entity';
import SentenceWord from '../../../../entities/sentence-word.entity';
import Word from '../../../../entities/word.entity';

export interface WordOfLearningSentenceDTO extends Word, SentenceWord {
  readonly wordId: number;
  readonly sentenceId: number;
  readonly koreanInText: string;
  readonly translationInText: string;
  readonly korean: string;
  readonly translation: string;
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

export default interface LearningSentenceDTO
  extends SentenceOfLearningSentenceDTO {
  readonly words: WordOfLearningSentenceDTO[];
}
