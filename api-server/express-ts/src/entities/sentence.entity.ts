/**
  @version feature/api/PEAC-38-learning-list-api
*/
import { pool } from '../db';
import { getSelectColumns } from '../utils/Query';

export class Sentence {
  constructor(
    readonly sentenceId: number,
    readonly unitIndex: number,
    readonly contentsId: number,
    readonly koreanText: string,
    readonly translatedText: string,
    readonly perfectVoiceUri: string,
    readonly isConversation: boolean,
    readonly isFamousLine: boolean,
    readonly startTime: string,
    readonly endTime: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}

  // id에 해당하는 문장 1개
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findOne = async (sentenceId: number, ..._columns: string[]) => {
    try {
      // SELECT할 컬럼이 최소 1개 이상 있어야 함
      if (_columns.length === 0)
        throw new Error('At least 1 column in _column is required');

      // SELECT 쿼리에 들어갈 컬럼 문자열 조합
      const SELECT_COLUMNS = getSelectColumns(_columns);

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence \
        WHERE sentence_id = ${sentenceId}`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows[0];
    } catch (error) {
      console.error('❌ Error: sentence.entity.ts findOne function ');
      throw error;
    }
  };

  // 유닛에 해당하는 문장 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static findByUnit = async (
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

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM sentence \
        WHERE content_id = ${contentId} AND unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('unitIndex or contentId does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error('❌ Error: sentence.entity.ts findByUnit function ');
      throw error;
    }
  };

  // 사용자의 학습 기록을 포함한 특정 유닛의 문장 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fullJoinUserSentenceHistory = async (
    userId: number,
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

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS}, COALESCE(user_sentence_history.is_bookmark, false) as "isBookmark"
        FROM sentence 
        FULL JOIN 
          (SELECT * FROM user_sentence_history 
          WHERE user_id = ${userId}) as user_sentence_history 
        ON sentence.sentence_id = user_sentence_history .sentence_id 
        WHERE sentence.content_id = ${contentId} AND sentence.unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error(
        '❌ Error: sentence.entity.ts fullJoinUserSentenceHistory function '
      );
      throw error;
    }
  };

  // 유닛에 포한된 문장 별 단어 리스트
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static joinWord = async (
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

      const queryResult = await pool.query(
        `SELECT ${SELECT_COLUMNS}
        FROM sentence 
        JOIN word
        ON sentence.sentence_id = word.sentence_id 
        WHERE sentence.content_id = ${contentId} AND sentence.unit_index = ${unitIndex}`
      );
      if (!queryResult.rowCount)
        throw new Error('contentId or unitIndex does not exist');

      return queryResult.rows;
    } catch (error) {
      console.error('❌ Error: sentence.entity.ts joinWord function ');
      throw error;
    }
  };
}
