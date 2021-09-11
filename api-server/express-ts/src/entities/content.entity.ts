/**
  @version feature/api/PEAC-38-learning-list-api
*/

import { PoolClient } from 'pg';
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

  // 콘텐츠 1개에 대한 row 반환
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (
    client: PoolClient,
    contentId: number,
    ..._columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
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

  // user_content_history 테이블과 left join (progress_rate 컬럼을 위해)
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static leftJoinUserContentHistory = async (
    client: PoolClient,
    userId: number,
    ..._columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS}, COALESCE(user_content_history.progress_rate, 0) as "progressRate"
        FROM content 
        LEFT JOIN 
          (SELECT * FROM user_content_history 
          WHERE user_id = ${userId}) as user_content_history 
        ON content.content_id = user_content_history.content_id`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error(
        '❌ Error: content.entity.ts joinUserContentHistory function '
      );
      throw error;
    }
  };
}
