/* eslint-disable no-console */
/**
 * @description content 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import Content from '../entities/content.entity';
import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns, getSelectColumnsWithoutAs } from '../utils/Query';

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
        ORDER BY user_content_history.latest_learning_at DESC`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: content.repository.ts leftJoinUserContentHistory function '
      );
      throw error;
    }
  };

  // Home -> New contents
  // join unit AND sentence AND sentence_word
  static joinUnitAndSentenceAndSentenceWord = async (
    client: PoolClient,
    _columns: any[]
  ): Promise<any[]> => {
    const LIMIT_NUM = 5;
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);
      const GROUP_BY_COLUMNS = getSelectColumnsWithoutAs(_columns);

      // SELECT countsOfUnits, countsOfSentences, countsOfWords GROUP BY updatedAt
      const queryResult: QueryResult<any> = await client.query(
        `SELECT content.modified_at as "updatedAt", ${SELECT_COLUMNS},
          count(DISTINCT unit.unit_index) as "countsOfUnits", count(DISTINCT sentence_word.sentence_id) as "countsOfSentences", count(DISTINCT sentence_word.word_id) as "countsOfWords"
        FROM content
        JOIN unit
        ON content.content_id = unit.content_id
        JOIN sentence
        ON unit.content_id = sentence.content_id AND unit.unit_index = sentence.unit_index
        JOIN sentence_word
        ON sentence.sentence_id = sentence_word.sentence_id
        GROUP BY content.modified_at, ${GROUP_BY_COLUMNS}
        ORDER BY content.modified_at DESC LIMIT ${LIMIT_NUM}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: content.repository.ts joinUnitAndSentenceAndSentenceWord function '
      );
      throw error;
    }
  };
}
