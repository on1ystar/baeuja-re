/**
  @description 발음 평가 요청을 위한 DTO
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/

import { PoolClient } from 'pg';
import conf from '../../../config';
import { pool } from '../../../db';
import { Sentence } from '../../../entities/sentence.entity';

interface SentenceType {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly perfectVoiceUri: string;
}

const S3_URL = `https://s3.${conf.s3.region}.amazonaws.com`;

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
    const client: PoolClient = await pool.connect();
    try {
      const sentence: SentenceType = {
        sentenceId,
        ...(await Sentence.findOne(client, sentenceId, 'koreanText')),
        perfectVoiceUri: `${S3_URL}/${conf.s3.bucketData}/perfect-voice/sentences/${sentenceId}.wav`
      };
      return new PostEvaluationDTO(userId, userVoiceUri, sentence);
    } catch (error) {
      console.error('❌ Error: post-evaluation.dto.ts getInstance function');
      throw error;
    }
  }
}
