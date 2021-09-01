import { pool } from '../db';

/**
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/
export class Sentence {
  constructor(
    readonly sentenceId: number,
    readonly unitIndex: number,
    readonly contentsId: number,
    readonly koreanText: string,
    readonly translatedText: string,
    readonly perfectVoiceUri: string,
    readonly isConversation: boolean,
    readonly isFamousLine: boolean,
    readonly startTime: string,
    readonly endTime: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}

  // 유닛에 해당하는 문장 리스트
  static findByUnit = async (unitIndex: number, contentId: number) => {
    try {
      const queryResult = await pool.query(
        'SELECT sentence_id as "sentenceId" FROM sentence WHERE unit_index = $1 AND content_id = $2',
        [unitIndex, contentId]
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      const sentenceIdList: number[] = queryResult.rows.map(
        row => row.sentenceId
      );
      return sentenceIdList;
    } catch (error) {
      console.log('Error: Sentence findByUnit function ');
      throw error;
    }
  };
}
