/* eslint-disable no-console */
/**
 * @description sentence 테이블 SQL
 * @version feature/api/api-route-refactoring
 */

import { PoolClient, QueryResult } from 'pg';
import Sentence from '../entities/sentence.entity';
import { UnitPK } from '../entities/unit.entity';
import { getSelectColumns } from '../utils/Query';

export default class SentenceRepository {
  // id에 해당하는 문장 1개
  static findOne = async (
    client: PoolClient,
    sentenceId: number,
    _columns: any[]
  ): Promise<Sentence> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence \
        WHERE sentence_id = ${sentenceId}`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: sentence.repository.ts findOne function ');
      throw error;
    }
  };

  // 유닛에 해당하는 문장 리스트
  static findAllByUnit = async (
    client: PoolClient,
    { contentId, unitIndex }: UnitPK,
    _columns: any[]
  ): Promise<Sentence[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence 
        WHERE content_id = ${contentId} AND unit_index = ${unitIndex}
        ORDER BY sentence_id ASC`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: sentence.repository.ts findByUnit function ');
      throw error;
    }
  };

  // 사용자의 학습 기록을 포함한 특정 유닛의 문장 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static leftJoinUserSentenceHistory = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    unitIndex: number,
    _columns: any[]
  ) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      // , COALESCE(, false) as "isBookmark"
      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS}
        FROM sentence 
        LEFT JOIN user_sentence_history 
        ON sentence.sentence_id = user_sentence_history.sentence_id AND user_sentence_history.user_id = ${userId}
        WHERE sentence.content_id = ${contentId} AND sentence.unit_index = ${unitIndex}
        ORDER BY sentence.sentence_id ASC`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: sentence.repository.ts leftJoinUserSentenceHistory function '
      );
      throw error;
    }
  };

  // 유닛에 포한된 문장 별 단어 리스트
  static joinWord = async (
    client: PoolClient,
    contentId: number,
    unitIndex: number,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await client.query(
        `SELECT ${SELECT_COLUMNS}
        FROM sentence
        JOIN sentence_word
        ON sentence.sentence_id = sentence_word.sentence_id
        JOIN word
        ON sentence_word.word_id = word.word_id 
        WHERE sentence.content_id = ${contentId} AND sentence.unit_index = ${unitIndex}
        ORDER BY word.word_id ASC`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: sentence.repository.ts joinWord function ');
      throw error;
    }
  };
}
