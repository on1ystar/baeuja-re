/* eslint-disable no-console */
/**
 * @description qna 테이블 SQL
 * @version feature/api/PEAC-213-QnA-table
 */

import { PoolClient, QueryResult } from 'pg';
import Qna from '../entities/qna.entity';
import { getSelectColumns } from '../utils/Query';

const defaultTimezone = '00:09';

export interface QnaToBeSaved extends Qna {
  readonly userId: number;
  readonly title: string;
  readonly content: string;
  readonly qnaTypeId: number;
}

export default class QnaRepository {
  // qna 생성(사용자 문의 등록)
  static save = async (
    client: PoolClient,
    { userId, title, content, qnaTypeId }: QnaToBeSaved
  ): Promise<number> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `INSERT INTO qna(user_id, title, content, qna_type_id, answered_at)
        VALUES($1, $2, $3, $4, NULL)
        RETURNING qna_id`,
        [userId, title, content, qnaTypeId]
      );
      return queryResult.rows[0].qna_id;
    } catch (error) {
      console.warn('❌ Error: qna.repository.ts save function ');
      throw error;
    }
  };

  // 한 유저의 qna list 조회
  static findAllByUserId = async (
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
        `SELECT ${SELECT_COLUMNS} FROM qna
        WHERE user_id = ${userId}`
      );
      // if (!queryResult.rowCount) throw new Error('qnaId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn('❌ Error: qna.repository.ts findAllByUserId function ');
      throw error;
    }
  };

  // 한 유저의 qna 1개 조회
  static findOneByUserId = async (
    client: PoolClient,
    userId: number,
    qnaId: number,
    _columns: any[]
  ): Promise<any> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM qna
        WHERE user_id = ${userId}, qna_id = ${qnaId}`
      );

      if (!queryResult.rowCount) throw new Error('qnaId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: qna.repository.ts findOneByUserId function ');
      throw error;
    }
  };

  // update a qna's answer(문의 답변)
  static updateAnswer = async (
    client: PoolClient,
    qnaId: number,
    answer: string
  ): Promise<string> => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `UPDATE qna
        SET answer = '${answer}', answered_at = default
        WHERE qna_id = ${qnaId}
        RETURNING answered_at`
      );

      console.log(`✅ updated qna id: ${qnaId}  answer`);

      return queryResult.rows[0].answered_at;
    } catch (error) {
      console.warn('❌ Error: qna.repository.ts updateAnswer function ');
      throw error;
    }
  };

  // delete a qna's answer(문의 답변)
  static delete = async (client: PoolClient, qnaId: number): Promise<void> => {
    try {
      await client.query(
        `DELETE FROM qna
        WHERE qna_id = ${qnaId}`
      );

      console.info(`✅ deleted user id: ${qnaId}`);
    } catch (error) {
      console.warn('❌ Error: qna.repository.ts delete function ');
      throw error;
    }
  };
}
