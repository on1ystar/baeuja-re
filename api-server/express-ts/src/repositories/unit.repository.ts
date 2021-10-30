/* eslint-disable no-console */
/**
 * @description user_content_history 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import Unit from '../entities/unit.entity';
import { getSelectColumns } from '../utils/Query';

export default class UnitRepository {
  // id에 해당하는 유닛 1개
  static findOne = async (
    client: PoolClient,
    contentId: number,
    unitIndex: number,
    _columns: any[]
  ): Promise<Unit> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM unit 
        WHERE content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: unit.repository.ts findOne function ');
      throw error;
    }
  };

  // 콘탠츠에 해당하는 유닛 리스트
  static findAllByContentId = async (
    client: PoolClient,
    contentId: number,
    _columns: any[]
  ): Promise<Unit[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM unit 
        WHERE content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: unit.repository.ts findAllByContentId function ');
      throw error;
    }
  };

  // 사용자의 학습 기록을 포함한 특정 콘텐츠의 유닛 리스트
  static leftJoinUserUnitHistory = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM unit 
        LEFT JOIN user_unit_history 
        ON unit.content_id = user_unit_history.content_id 
            AND unit.unit_index = user_unit_history.unit_index 
            AND user_unit_history.user_id = ${userId}
        WHERE unit.content_id = ${contentId}
        ORDER BY unit.unit_index ASC`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: unit.repository.ts leftJoinUserUnitHistory function '
      );
      throw error;
    }
  };

  // 유닛 별 학습 문장 개수
  static getSentencesCounts = async (
    client: PoolClient,
    contentId: number
  ): Promise<any[]> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT unit.unit_index, count(*) FROM unit
        JOIN sentence
        ON unit.content_id = sentence.content_id AND unit.unit_index = sentence.unit_index AND sentence.perfect_voice_uri != 'NULL'
        WHERE unit.content_id = $1
        GROUP BY unit.unit_index
        ORDER BY unit.unit_index`,
        [contentId]
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: unit.repository.ts getSentencesCounts function ');
      throw error;
    }
  };

  // 유닛 별 학습 단어 개수
  static getWordsCounts = async (
    client: PoolClient,
    contentId: number
  ): Promise<any[]> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT unit.unit_index, count(*) FROM unit
        JOIN sentence
        ON unit.content_id = sentence.content_id AND unit.unit_index = sentence.unit_index
        JOIN sentence_word
        ON sentence.sentence_id = sentence_word.sentence_id
        WHERE unit.content_id = $1
        GROUP BY unit.unit_index
        ORDER BY unit.unit_index`,
        [contentId]
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: unit.repository.ts getWordsCounts function ');
      throw error;
    }
  };
}
