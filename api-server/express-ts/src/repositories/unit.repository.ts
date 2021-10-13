/* eslint-disable no-console */
/**
 * @description user_content_history 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import Unit from '../entities/unit.entity';
import Word from '../entities/word.entity';
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
      console.error('❌ Error: unit.repository.ts findOne function ');
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
      console.error(
        '❌ Error: unit.repository.ts findAllByContentId function '
      );
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
      console.error(
        '❌ Error: unit.repository.ts leftJoinUserUnitHistory function '
      );
      throw error;
    }
  };
}
