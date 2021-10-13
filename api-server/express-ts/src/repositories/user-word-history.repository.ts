import { PoolClient, QueryResult } from 'pg';
import { getSelectColumns } from '../utils/Query';

export default class WordRepository {
  // 사용자의 학습 기록을 포함한 특정 유닛의 문장 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static leftJoinUserWordHistory = async (
    client: PoolClient,
    userId: number,
    wordId: number,
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
        FROM word 
        LEFT JOIN user_word_history 
        ON word.word_id = user_word_history.word_id AND user_word_history.user_id = ${userId}
        WHERE word.word_id = ${wordId}
        ORDER BY word.word_id ASC`
      );
      if (!queryResult.rowCount)
        throw new Error('wordId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error(
        '❌ Error: sentence.repository.ts leftJoinUserSentenceHistory function '
      );
      throw error;
    }
  };
}
