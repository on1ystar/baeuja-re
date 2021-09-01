/**
  @description user_sentence_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
import { format } from 'morgan';
import { pool } from '../db';

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
  create = async () => {
    try {
      const ARRAY_INSERT_SQL = format('');

      await pool.query('');
    } catch (error) {
      console.log('Error: UserSentenceHistory create function ');
      throw error;
    }
  };

  // 성우 음성 재생 횟수 1 증가
}
