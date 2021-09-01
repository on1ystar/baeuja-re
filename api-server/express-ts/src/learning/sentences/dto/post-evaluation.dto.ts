/**
  @description 발음 평가 요청을 위한 DTO
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/

import { DatabaseError, QueryResult } from 'pg';
import { pool } from '../../../db';

interface SentenceType {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly perfectVoiceUri: string;
}

export default class PostEvaluationDTO {
  constructor(
    readonly userId: number,
    readonly userVoiceUri: string,
    readonly sentence: SentenceType
  ) {}

  static async getInstance(
    userId: number,
    userVoiceUri: string,
    sentenceId: number
  ): Promise<PostEvaluationDTO> {
    try {
      const sentence: SentenceType = {
        sentenceId,
        ...(await this.getSentence(sentenceId)),
        perfectVoiceUri: `https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/perfect-voice/sentences/${sentenceId}.wav`
      };
      return new PostEvaluationDTO(userId, userVoiceUri, sentence);
    } catch (error) {
      throw error;
    }
  }

  static getSentence = async (sentenceId: number) => {
    try {
      const queryResult: QueryResult<any> = await pool.query(
        'SELECT  korean_text as "koreanText" FROM sentence WHERE sentence_id = $1',
        [sentenceId]
      );
      if (!queryResult.rowCount) {
        throw new Error('sentenceId does not exist');
      }
      return queryResult.rows[0];
    } catch (error) {
      console.error('Error: PostEvaluationDTO getSentence function ');
      throw error;
    }
  };
}
