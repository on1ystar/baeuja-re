/**
  @version hotfix/api/PEAC-38-progressRate
*/

import { PoolClient } from 'pg';
import { getSelectColumns } from '../utils/Query';

export class Unit {
  constructor(
    readonly unitIndex: number,
    readonly contentId: number,
    readonly youtubeUrl: string,
    readonly startTime: string,
    readonly endTime: string,
    readonly thumbnailUri: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}

  // id에 해당하는 유닛 1개
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (
    client: PoolClient,
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

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM unit \
        WHERE content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: unit.entity.ts findOne function ');
      throw error;
    }
  };

  // 콘탠츠에 해당하는 유닛 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findByContent = async (
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
        `SELECT ${SELECT_COLUMNS} FROM unit \
        WHERE content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error('❌ Error: unit.entity.ts findByContent function ');
      throw error;
    }
  };

  // 사용자의 학습 기록을 포함한 특정 콘텐츠의 유닛 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static leftJoinUserUnitHistory = async (
    client: PoolClient,
    userId: number,
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
        `SELECT ${SELECT_COLUMNS} FROM unit 
        LEFT JOIN 
        (SELECT * FROM user_unit_history 
        WHERE user_id = ${userId}) as user_unit_history 
        ON unit.content_id = user_unit_history.content_id AND unit.unit_index = user_unit_history.unit_index  
        WHERE unit.content_id = ${contentId}`
      );
      if (!queryResult.rowCount) throw new Error('contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error(
        '❌ Error: unit.entity.ts leftJoinUserUnitHistory function '
      );
      throw error;
    }
  };

  // 유닛에 포한된 단어 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static leftJoinSentenceAndWord = async (
    client: PoolClient,
    contentId: number,
    unitIndex: number,
    ..._columns: string[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM unit \
        LEFT JOIN sentence \
        ON unit.content_id = sentence.content_id AND unit.unit_index = sentence.unit_index  \
        LEFT JOIN word \
        ON sentence.sentence_id = word.sentence_id \
        WHERE unit.content_id = ${contentId} AND unit.unit_index = ${unitIndex} AND word.word_id IS NOT NULL`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error(
        '❌ Error: unit.entity.ts leftJoinSentenceAndWord function '
      );
      throw error;
    }
  };
}
