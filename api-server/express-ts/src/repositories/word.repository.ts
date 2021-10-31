import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns } from '../utils/Query';

export default class WordRepository {
  // 단어 1개 조회
  static findOne = async (
    client: PoolClient,
    wordId: number,
    _columns: any[]
  ): Promise<any> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM word
          WHERE word_id = ${wordId}`
      );
      if (!queryResult.rowCount) throw new Error('wordId does not exist');
      return queryResult.rows[0];
    } catch (error) {
      console.warn('❌ Error: word.repository.ts findOne function ');
      throw error;
    }
  };

  static leftJoinUserWordHistory = async (
    client: PoolClient,
    userId: number,
    wordId: number,
    _columns: any[]
  ): Promise<any> => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult: QueryResult<any> = await client.query(
        `SELECT ${SELECT_COLUMNS} FROM word
        LEFT JOIN user_word_history
        ON word.word_id = user_word_history.word_id AND user_word_history.user_id = ${userId}
        WHERE word.word_id = ${wordId}`
      );
      if (!queryResult.rowCount) throw new Error('wordId does not exist');
      return queryResult.rows[0];
    } catch (error) {
      console.warn(
        '❌ Error: word.repository.ts leftJoinUserWordHistory function '
      );
      throw error;
    }
  };
}
