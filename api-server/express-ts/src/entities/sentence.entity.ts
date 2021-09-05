/**
  @version feature/api/PEAC-38-learning-list-api
*/
import { pool } from '../db';
import { snakeCase } from 'snake-case';
import { getSelectColumns } from '../utils/Query';

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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findByUnit = async (
    unitIndex: number,
    contentId: number,
    ..._columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence WHERE unit_index = $1 AND content_id = $2`,
        [unitIndex, contentId]
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.log('Error: sentence.entity.ts findByUnit function ');
      throw error;
    }
  };
}
