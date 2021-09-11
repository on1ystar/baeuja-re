/**
  @description 메인(문장) 학습 화면 구성을 위한 DTO
  @version feature/api/PEAC-38-learning-list-api
 */
import { Sentence } from '../../../entities/sentence.entity';
import { Unit } from '../../../entities/unit.entity';

// ------------------ class properties를 위한 interface ------------------
interface WordType {
  readonly wordId: number;
  readonly sentenceId: number;
  readonly prevKoreanText: string;
  readonly prevTranslatedText: string;
  readonly originalKoreanText: string;
  readonly originalTranslatedText: string;
}

interface SentenceType {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly perfectVoiceUri: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly isBookmark: true;
  readonly words: WordType[];
}

interface UnitType {
  readonly unitIndex: number;
  readonly contentId: number;
  readonly youtubeUrl: string;
  readonly startTime: string;
  readonly endTime: string;
}
// --------------------------------------------------------------------

// getInstance(userId: number, unitIndex: number, contentId: number)를 호출해서 인스턴스 생성
export default class GetUnitDTO {
  readonly unit: UnitType;

  readonly sentences: SentenceType[];

  constructor(unit: UnitType, sentences: SentenceType[]) {
    this.unit = unit;
    this.sentences = sentences;
  }

  // GetUnitDTO 객체 반환
  static async getInstance(
    userId: number,
    contentId: number,
    unitIndex: number
  ): Promise<GetUnitDTO> {
    try {
      const unit: UnitType = await Unit.findOne(
        unitIndex,
        contentId,
        'unitIndex',
        'contentId',
        'youtubeUrl',
        'startTime',
        'endTime'
      );
      const sentences: SentenceType[] =
        await Sentence.fullJoinUserSentenceHistory(
          userId,
          contentId,
          unitIndex,
          'Sentence.sentenceId',
          'Sentence.koreanText',
          'Sentence.translatedText',
          'Sentence.perfectVoiceUri',
          'Sentence.startTime',
          'Sentence.endTime'
        );
      const words: WordType[] = await Sentence.joinWord(
        contentId,
        unitIndex,
        'Word.wordId',
        'Word.sentenceId',
        'Word.prevKoreanText',
        'Word.prevTranslatedText',
        'Word.originalKoreanText',
        'Word.originalTranslatedText'
      );
      const mappedSentences = sentences.map((sentence: SentenceType) => {
        return {
          ...sentence,
          words: words.filter(word => word.sentenceId === sentence.sentenceId)
        };
      });
      return new GetUnitDTO(unit, mappedSentences);
    } catch (error) {
      console.error('❌ Error: get-unit.dto.ts getInstance function');
      throw error;
    }
  }
}
