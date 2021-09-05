/**
  @description 메인(문장) 학습 화면 구성을 위한 DTO
  @version feature/api/PEAC-38-learning-list-api
 */
import { QueryResult } from 'pg';
import { pool } from '../../../db';
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

  constructor(unit: UnitType, sentences: any) {
    this.unit = unit;
    this.sentences = sentences;
  }

  // GetUnitDTO 객체 반환
  static async getInstance(
    userId: number,
    unitIndex: number,
    contentId: number
  ): Promise<GetUnitDTO> {
    try {
      const unit: UnitType = await Unit.findOne(
        unitIndex,
        contentId,
        'youtubeUrl',
        'startTime',
        'endTime'
      );
      const sentences: SentenceType[] = await this.getSentences(
        userId,
        unitIndex,
        contentId
      );
      const words: WordType[] = await this.getWords(unitIndex, contentId);
      const mappedSentences = sentences.map((sentence: SentenceType) => {
        return {
          ...sentence,
          words: words.filter(word => word.sentenceId === sentence.sentenceId)
        };
      });
      return new GetUnitDTO(unit, mappedSentences);
    } catch (error) {
      throw error;
    }
  }

  static async getSentences(
    userId: number,
    unitIndex: number,
    contentId: number
  ): Promise<SentenceType[]> {
    try {
      // FULL JOIN sentence ON user_sentence_history for (sentence_id, korean_text, translated_text, perfect_voice_uri, start_time, end_time, is_bookmark)
      const queryResult: QueryResult<any> = await pool.query(
        'SELECT s.sentence_id as "sentenceId", s.korean_text as "koreanText", s.translated_text as "translatedText", s.perfect_voice_uri as "perfectVoiceUrl", s.start_time as "startTime", s.end_time as "endTime", COALESCE(h.is_bookmark, false) as "isBookmark"\
            FROM sentence as s \
            FULL JOIN (SELECT user_id, sentence_id, is_bookmark FROM user_sentence_history WHERE user_id = $1) as h \
            ON s.sentence_id = h.sentence_id \
            WHERE s.content_id = $2 AND s.unit_index = $3 ',
        [userId, contentId, unitIndex]
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      const sentences: SentenceType[] = queryResult.rows;
      return sentences;
    } catch (error) {
      console.error('Error: get-unit.dto.ts getSentences function ');
      throw error;
    }
  }

  static async getWords(
    unitIndex: number,
    contentId: number
  ): Promise<WordType[]> {
    // JOIN word ON sentence for (word_id, sentence_id, original_korean_text, prev_korean_text,, prev_translated_text, original_korean_text, originalKoreanText, original_translated_text)
    const queryResult: QueryResult<any> = await pool.query(
      'SELECT w.word_id as "wordId", w.sentence_id as "sentenceId", w.original_korean_text, w.prev_korean_text as "prevKoreanText",w.prev_translated_text as "prevTranslatedText",w.original_korean_text as "originalKoreanText",w.original_translated_text as "originalTranslatedText"\
          FROM word as w \
          JOIN sentence as s \
          ON s.sentence_id = w.sentence_id \
          WHERE s.unit_index = $1 AND s.content_id = $2',
      [unitIndex, contentId]
    );
    if (!queryResult.rowCount)
      throw new Error('unitIndex or contentId does not exist');

    try {
      const words: WordType[] = queryResult.rows;
      return words;
    } catch (error) {
      console.error('Error: get-unit.dto.ts getWords function ');
      throw error;
    }
  }
}
