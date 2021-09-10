/**
  @version feature/api/PEAC-38-learning-list-api
*/

import { pool } from '../db';
import { getSelectColumns } from '../utils/Query';

export class Content {
  constructor(
    readonly contentId: number,
    readonly classification: string,
    readonly title: string,
    readonly description: string,
    readonly youtubeUrl: string,
    readonly thumbnailUri: string,
    readonly artist?: string,
    readonly director?: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}

  static findOne = async (contentId: number, ..._columns: string[]) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM content \
        WHERE content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: content.entity.ts findOne function ');
      throw error;
    }
  };
}
