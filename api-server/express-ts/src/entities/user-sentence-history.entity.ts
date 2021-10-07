/**
  @description user_sentence_history entity with repository
  @version hotfix/api/PEAC-38-progressRate
*/
import { PoolClient, QueryResult } from 'pg';
import format from 'pg-format';
import { getNowKO } from '../utils/Date';
import { Sentence } from './sentence.entity';

const DEFAULT_LEARNING_RATE = 0;

export class UserSentenceHistory {
  constructor(
    readonly userId: number,
    readonly sentenceId: number,
    readonly perfectVoiceCounts?: number,
    readonly userVoiceCounts?: number,
    readonly averageScore?: number,
    readonly highestScore?: number,
    readonly learningRate?: number,
    readonly latestLearningAt?: string,
    readonly isBookmark?: boolean,
    readonly bookmarkAt?: string
  ) {}

  // 사용자 문장 학습 기록 생성
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

  create = async (client: PoolClient) => {
    try {
      const qeuryResult = await client.query(
        `INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) 
        VALUES($1, $2, $3, $4)`,
        [this.userId, this.sentenceId, getNowKO(), DEFAULT_LEARNING_RATE]
      );

      console.info(
        `✅ inserted user_sentence_history table's row [${
          (this.userId, this.sentenceId)
        }]`
      );
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts create function '
      );
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updatePerfectVoiceCounts = async (client: PoolClient) => {
    try {
      const perfectVoiceCounts = (
        await client.query(
          `UPDATE user_sentence_history 
          SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = ${getNowKO()} 
          WHERE user_id = ${this.userId} AND sentence_id = ${this.sentenceId} 
          RETURNING perfect_voice_counts`
        )
      ).rows[0].perfect_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's perfect_voice_counts"
      );
      return perfectVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts updatePerfectVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 음성 재생 횟수 1 증가
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateUserVoiceCounts = async (client: PoolClient) => {
    try {
      const userVoiceCounts = (
        await client.query(
          `UPDATE user_sentence_history 
          SET user_voice_counts = user_voice_counts + 1, latest_learning_at = ${getNowKO()} 
          WHERE user_id = ${this.userId} AND sentence_id = ${
            this.sentenceId
          } RETURNING user_voice_counts`
        )
      ).rows[0].user_voice_counts;
      console.info(
        "✅ updated user_sentence_history table's user_voice_counts"
      );
      return userVoiceCounts;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts updateUserVoiceCounts function '
      );
      throw error;
    }
  };

  // 사용자 문장 학습 기록 존재 여부
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static isExist = async (
    client: PoolClient,
    userId: number,
    sentenceId: number
  ) => {
    try {
      const queryResult: QueryResult<any> = await client.query(
        `SELECT COUNT(*) FROM user_sentence_history
        WHERE user_id = ${userId} AND sentence_id = ${sentenceId} `
      );

      // 존재하지 않음
      if (+queryResult.rows[0].count === 0) return false;
      return true;
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts isExist function '
      );
      throw error;
    }
  };

  // 사용자 문장 학습 기록 생성
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static createList = async (
    client: PoolClient,
    userId: number,
    sentencesId: any
  ) => {
    try {
      const ARRAY_INSERT_SQL = format(
        `INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) 
        VALUES %L`,
        sentencesId.map((sentenceId: any) => [
          userId,
          sentenceId,
          getNowKO(),
          DEFAULT_LEARNING_RATE
        ])
      );

      await client.query(ARRAY_INSERT_SQL);
      console.info("✅ inserted user_sentence_history table's rows");
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts createList function '
      );
      throw error;
    }
  };

  // 유닛에 포함된 문장들의 최근 학습 시간 갱신
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static updateLatestLearningAtByUnit = async (
    client: PoolClient,
    userId: number,
    contentId: number,
    unitIndex: number
  ) => {
    try {
      const sentenceIdList = await Sentence.findByUnit(
        client,
        contentId,
        unitIndex,
        ['sentenceId']
      );

      await client.query(
        `UPDATE user_sentence_history 
          SET latest_learning_at = ${getNowKO()} 
          WHERE user_id = ${userId} AND ${
          sentenceIdList[0].sentenceId
        } <= sentence_id AND sentence_id <= ${
          sentenceIdList[sentenceIdList.length - 1].sentenceId
        }`
      );
      console.info(
        "✅ updated user_sentence_history table's latest_learning_at"
      );
    } catch (error) {
      console.error(
        '❌ Error: user-sentence-history.entity.ts updateLatestLearningAtByUnit function '
      );
      throw error;
    }
  };
}
