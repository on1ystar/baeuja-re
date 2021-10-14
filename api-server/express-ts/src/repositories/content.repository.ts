/* eslint-disable no-console */
/**
 * @description content 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import Content from '../entities/content.entity';
import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns } from '../utils/Query';

export default class ContentRepository {
  // 콘텐츠 1개에 대한 row 반환
  static findOne = async (
    client: PoolClient,
    contentId: number,
    _columns: any[]
  ): Promise<Content> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM content
        WHERE content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');
      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: content.repository.ts findOne function ');
      throw error;
    }
  };

  // user_content_history 테이블과 left join (progress_rate 컬럼을 위해)
  static leftJoinUserContentHistory = async (
    client: PoolClient,
    userId: number,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS}
        FROM content 
        LEFT JOIN user_content_history 
        ON content.content_id = user_content_history.content_id AND user_id = ${userId}
        ORDER BY content.content_id ASC`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: ontent.repository.ts leftJoinUserContentHistory function '
      );
      throw error;
    }
  };
}
