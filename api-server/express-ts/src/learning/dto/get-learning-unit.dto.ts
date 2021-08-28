/*
  메인(문장) 학습 화면 구성을 위한 DTO
 */
import { DatabaseError, QueryResult } from 'pg';
import { Sentence } from 'src/entities/sentence.entity';
import { Unit } from 'src/entities/unit.entity';
import { Word } from 'src/entities/word.entity';
import { pool } from '../../db';

// ------------------ class properties를 위한 interface ------------------
interface WordType extends Word {
  readonly wordId: number;
  readonly sentenceId: number;
  readonly prevKoreanText: string;
  readonly prevTranslatedText: string;
  readonly originalKoreanText: string;
  readonly originalTranslatedText: string;
}

interface SentenceType extends Sentence {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly perfectVoiceUri: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly isBookmark: true;
  readonly words: WordType[];
}

interface UnitType extends Unit {
  readonly unitIndex: number;
  readonly contentId: number;
  readonly youtubeUrl: string;
  readonly startTime: string;
  readonly endTime: string;
}
// --------------------------------------------------------------------

// getInstance(userId: number, unitIndex: number, contentId: number)를 호출해서 인스턴스 생성
export class GetLearningUnitDTO {
  readonly unit: UnitType;

  readonly sentences: SentenceType[];

  constructor(unit: UnitType, sentences: any) {
    this.unit = unit;
    this.sentences = sentences;
  }

  // GetLearningUnitDTO 객체 반환
  static async getInstance(
    userId: number,
    unitIndex: number,
    contentId: number
  ): Promise<GetLearningUnitDTO> {
    try {
      const unit: UnitType = await this.getUnit(unitIndex, contentId);
      const sentences: SentenceType[] = await this.getSentences(
        userId,
        unitIndex,
        contentId
      );
      const words: Word[] = await this.getWords(unitIndex, contentId);
      const mappedSentences = sentences.map((sentence: SentenceType) => {
        return {
          ...sentence,
          words: words.filter(word => word.sentenceId === sentence.sentenceId)
        };
      });
      return new GetLearningUnitDTO(unit, mappedSentences);
    } catch (error) {
      throw error;
    }
  }

  // SELECT unit
  static async getUnit(
    unitIndex: number,
    contentId: number
  ): Promise<UnitType> {
    try {
      const queryResult: QueryResult<any> = await pool.query(
        'SELECT youtube_url as "youtubeUrl", start_time as "startTime", end_time as "endTime" FROM unit WHERE "unit_index" = $1 AND "content_id" = $2',
        [unitIndex, contentId]
      );
      if (!queryResult.rowCount) {
        throw new DatabaseError(
          'unitIndex or contentsId does not exist',
          0,
          'noData'
        );
      }
      const unit: UnitType = {
        unitIndex,
        contentId,
        ...queryResult.rows[0]
      };
      return unit;
    } catch (error) {
      console.error('Error: getWords function ');
      throw error;
    }
  }

  // FULL JOIN sentence ON user_sentence_history
  static async getSentences(
    userId: number,
    unitIndex: number,
    contentId: number
  ): Promise<SentenceType[]> {
    try {
      const queryResult: QueryResult<any> = await pool.query(
        'SELECT s.sentence_id as "sentenceId", s.korean_text as "koreanText", s.translated_text as "translatedText", s.perfect_voice_uri as "perfectVoiceUrl", s.start_time as "startTime", s.end_time as "endTime", COALESCE(h.is_bookmark, false) as "isBookmark"\
            FROM sentence as s \
            FULL JOIN (SELECT user_id, sentence_id, is_bookmark FROM user_sentence_history WHERE user_id = $1) as h \
            ON s.sentence_id = h.sentence_id \
            WHERE s.content_id = $2 AND s.unit_index = $3 ',
        [userId, contentId, unitIndex]
      );
      if (!queryResult.rowCount) {
        throw new DatabaseError(
          'unitIndex or contentsId does not exist',
          0,
          'noData'
        );
      }
      const sentences: SentenceType[] = queryResult.rows;
      return sentences;
    } catch (error) {
      console.error('Error: getSentences function ');
      throw error;
    }
  }

  // JOIN word ON sentence
  static async getWords(
    unitIndex: number,
    contentId: number
  ): Promise<WordType[]> {
    const queryResult: QueryResult<any> = await pool.query(
      'SELECT w.word_id as "wordId", w.sentence_id as "sentenceId", w.original_korean_text, w.prev_korean_text as "prevKoreanText",w.prev_translated_text as "prevTranslatedText",w.original_korean_text as "originalKoreanText",w.original_translated_text as "originalTranslatedText"\
          FROM word as w \
          JOIN sentence as s \
          ON s.sentence_id = w.sentence_id \
          WHERE s.unit_index = $1 AND s.content_id = $2',
      [unitIndex, contentId]
    );
    if (!queryResult.rowCount) {
      throw new DatabaseError(
        'unitIndex or contentsId does not exist',
        0,
        'noData'
      );
    }
    try {
      const words: WordType[] = queryResult.rows;
      return words;
    } catch (error) {
      console.error('Error: getWords function ');
      throw error;
    }
  }
}
