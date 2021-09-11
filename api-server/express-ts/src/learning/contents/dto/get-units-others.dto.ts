/**
 * @description 학습 유닛 리스트 화면 구성을 위한 DTO (K-DRAMA, K-MIVIE)
 * @version feature/api/PEAC-38-learning-list-api
 */

import { PoolClient } from 'pg';
import { pool } from '../../../db';
import { Sentence } from '../../../entities/sentence.entity';
import { Unit } from '../../../entities/unit.entity';

interface SentenceType {
  readonly sentenceId: number;
  readonly koreanText: string;
  readonly translatedText: string;
  readonly isConversation: true;
  readonly isFamousLine: true;
  readonly learningRate: number;
  readonly isBookmark: true;
}

export default class GetUnitsOthersDTO {
  constructor(
    readonly contentId: number,
    readonly unitIndex: number,
    readonly thumbnailUri: string,
    readonly latestLearningAt: string,
    readonly sentence: SentenceType // 대표 문장
  ) {}

  static getInstances = async (userId: number, contentId: number) => {
    const client: PoolClient = await pool.connect();
    try {
      const units = await Unit.leftJoinUserUnitHistory(
        client,
        userId,
        contentId,
        'Unit.unitIndex',
        'Unit.thumbnailUri',
        'UserUnitHistory.latestLearningAt'
      );
      const mappedUnitList = units.map(async unit => {
        const sentence: SentenceType = (
          await Sentence.fullJoinUserSentenceHistory(
            client,
            userId,
            contentId,
            unit.unitIndex,
            'Sentence.sentenceId',
            'Sentence.koreanText',
            'Sentence.translatedText',
            'Sentence.isConversation',
            'Sentence.isFamousLine',
            'UserSentenceHistory.learningRate'
          )
        )[0];

        return new GetUnitsOthersDTO(
          contentId,
          unit.unitIndex,
          unit.thumbnailUri,
          unit.latestLearningAt,
          sentence
        );
      });
      return mappedUnitList;
    } catch (error) {
      console.error('❌ Error: get-units-others.dto.ts getInstance function');
      throw error;
    } finally {
      client.release();
    }
  };
}
