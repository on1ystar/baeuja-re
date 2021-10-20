/* eslint-disable no-console */
/**
 * @description qna_type 테이블 SQL
 * @version feature/api/PEAC-213-QnA-table
 */

import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns } from '../utils/Query';

export default class QnaTypeRepository {
  static findAll = async (
    client: PoolClient,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM qna_type`
      );
      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: qna-type.repository.ts findAll function ');
      throw error;
    }
  };
}
