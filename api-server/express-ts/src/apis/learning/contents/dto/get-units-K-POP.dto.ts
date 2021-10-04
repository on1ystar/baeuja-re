/**
 * @description 학습 유닛 리스트 화면 구성을 위한 DTO (K-POP)
 * @version feature/api/PEAC-38-learning-list-api
 */

import { PoolClient } from 'pg';
import { pool } from '../../../../db';
import { Sentence } from '../../../../entities/sentence.entity';
import { Unit } from '../../../../entities/unit.entity';

interface WordType {
  readonly wordId: number;
  readonly originalKoreanText: string;
}

export default class GetUnitsKPOPDTO {
  constructor(
    readonly contentId: number,
    readonly unitIndex: number,
    readonly thumbnailUri: string,
    readonly latestLearningAt: string,
    readonly sentencesCounts: number,
    readonly wordsCounts: number,
    readonly words: WordType[]
  ) {}

  static getInstances = async (userId: number, contentId: number) => {
    const client: PoolClient = await pool.connect();
    try {
      const units = await Unit.leftJoinUserUnitHistory(
        client,
        userId,
        contentId,
        [
          'Unit.unitIndex',
          'Unit.thumbnailUri',
          'UserUnitHistory.latestLearningAt'
        ]
      );
      const mappedUnitList = units.map(async unit => {
        const sentencesCounts = (
          await Sentence.findByUnit(client, contentId, unit.unitIndex, [
            'sentenceId'
          ])
        ).length;
        const words: WordType[] = await Unit.leftJoinSentenceAndWord(
          client,
          contentId,
          unit.unitIndex,
          ['Word.wordId', 'Word.originalKoreanText']
        );
        const wordsCounts = words.length;
        return new GetUnitsKPOPDTO(
          contentId,
          unit.unitIndex,
          unit.thumbnailUri,
          unit.latestLearningAt,
          sentencesCounts,
          wordsCounts,
          words
        );
      });
      return mappedUnitList;
    } catch (error) {
      console.error('❌ Error: get-units-K-POP.dto.ts getInstance function');
      throw error;
    } finally {
      client.release();
    }
  };
}
