import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns } from '../utils/Query';

export default class SentenceWordRepository {
  // 문장 테이블과 조인
  static joinSentence = async (
    client: PoolClient,
    wordId: number,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence_word
        JOIN sentence
        ON sentence_word.sentence_id = sentence.sentence_id
        WHERE sentence_word.word_id = ${wordId}`
      );
      if (!queryResult.rowCount) throw new Error('wordId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: sentece_word.repository.ts joinSentence function '
      );
      throw error;
    }
  };

  // JOIN sentence AND unit
  static joinSentenceAndUnit = async (
    client: PoolClient,
    wordId: number,
    _columns: any[]
  ): Promise<any[]> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence_word
        JOIN sentence
        ON sentence_word.sentence_id = sentence.sentence_id
        JOIN unit
        ON sentence.content_id = unit.content_id AND sentence.unit_index = unit.unit_index
        WHERE sentence_word.word_id = ${wordId}`
      );
      // if (!queryResult.rowCount) throw new Error('wordId does not exist');
      return queryResult.rows;
    } catch (error) {
      console.warn(
        '❌ Error: sentece_word.repository.ts joinSentenceAndUnit function '
      );
      throw error;
    }
  };
}
