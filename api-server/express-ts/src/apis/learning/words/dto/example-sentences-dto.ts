import SentenceWord from '../../../../entities/sentence-word.entity';
import Sentence from '../../../../entities/sentence.entity';

export default interface ExampleSentencesDTO extends Sentence, SentenceWord {
  readonly sentenceId: number;
  readonly contentId: number;
  readonly unitIndex: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly koreanInText: string;
  readonly translationInText: string;
}
