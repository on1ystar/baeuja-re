/**
 * @description 학습 유닛 리스트 화면 구성을 위한 DTO (K-POP)
 * @version feature/api/PEAC-38-learning-list-api
 */

import { Sentence } from '../../../entities/sentence.entity';
import { Unit } from '../../../entities/unit.entity';

interface WordType {
  readonly wordId: number;
  readonly originalKoreanText: string;
}

export default class GetUnitListKPOPDTO {
  constructor(
    readonly contentId: number,
    readonly unitIndex: number,
    readonly thumbnailUri: string,
    readonly latestLearningAt: string,
    readonly sentencesCounts: number,
    readonly wordsCounts: number,
    readonly words: WordType[]
  ) {}

  static getInstance = async (userId: number, contentId: number) => {
    try {
      const unitList = await Unit.leftJoinUserUnitHistory(
        userId,
        contentId,
        'Unit.unitIndex',
        'Unit.thumbnailUri',
        'UserUnitHistory.latestLearningAt'
      );
      const mappedUnitList = unitList.map(async unit => {
        const sentencesCounts = (
          await Sentence.findByUnit(contentId, unit.unitIndex, 'sentenceId')
        ).length;
        const words: WordType[] = await Unit.leftJoinSentenceAndWord(
          contentId,
          unit.unitIndex,
          'Word.wordId',
          'Word.originalKoreanText'
        );
        const wordsCounts = words.length;
        return new GetUnitListKPOPDTO(
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
      console.error(
        '❌ Error: get-unit-list-K-POP.dto.ts getInstance function'
      );
      throw error;
    }
  };
}
