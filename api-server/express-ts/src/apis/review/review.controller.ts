import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import UserSentenceEvaluationRepository from '../../repositories/user-sentence-evaluation.repository';
import UserSentenceHistoryRepository from '../../repositories/user-sentence-history.repository';
import UserWordEvaluationRepository from '../../repositories/user-word-evaluation.repository';
import UserWordHistoryRepository from '../../repositories/user-word-history.repository';

// GET /review
export const getLearningHistory = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const client: PoolClient = await pool.connect();
  try {
    const learningHistory = {
      countsOfSentences:
        await UserSentenceHistoryRepository.getUserHistoryCounts(
          client,
          userId
        ),
      countsOfWords: await UserWordHistoryRepository.getUserHistoryCounts(
        client,
        userId
      ),
      // 소수점 2째자리에서 반올림
      averageScoreOfSentences:
        Math.round(
          (await UserSentenceHistoryRepository.getAverageOfAverageScore(
            client,
            userId
          )) *
            10 *
            2
        ) /
        (10 * 2),
      // 소수점 2째자리에서 반올림
      averageScoreOfWords:
        Math.round(
          (await UserWordHistoryRepository.getAverageOfAverageScore(
            client,
            userId
          )) *
            10 *
            2
        ) /
        (10 * 2)
    };
    return res.status(200).json({ success: true, learningHistory });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /review/sentences
export const getReviewSentences = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { sortBy, option } = req.query;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (
      (sortBy !== undefined &&
        sortBy !== 'latest_learning_at' &&
        sortBy !== 'average_score' &&
        sortBy !== 'highest_score') ||
      (option !== undefined && option !== 'DESC' && option !== 'ASC')
    )
      throw new Error("invalid query string's syntax");

    const sentences: any[] = await UserSentenceHistoryRepository.joinSentence(
      client,
      userId,
      sortBy === undefined ? 'latest_learning_at' : sortBy, // default = latest_learning_at
      option === undefined ? 'DESC' : option, // default = DESC
      [
        {
          Sentence: [
            'sentenceId',
            'contentId',
            'unitIndex',
            'koreanText',
            'translatedText',
            'startTime'
          ]
        },
        {
          UserSentenceHistory: [
            'averageScore',
            'highestScore',
            'isBookmark',
            'latestLearningAt',
            'bookmarkAt'
          ]
        }
      ]
    );

    return res.status(200).json({ success: true, sentences });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /review/words
export const getReviewWords = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { sortBy, option } = req.query;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (
      (sortBy !== undefined &&
        sortBy !== 'latest_learning_at' &&
        sortBy !== 'average_score' &&
        sortBy !== 'highest_score' &&
        sortBy !== 'importance') ||
      (option !== undefined && option !== 'DESC' && option !== 'ASC')
    )
      throw new Error("invalid query string's syntax");

    const words: any[] = await UserWordHistoryRepository.joinWord(
      client,
      userId,
      sortBy === undefined ? 'latest_learning_at' : sortBy, // default = latest_learning_at
      option === undefined ? 'DESC' : option, // default = DESC
      [
        {
          Word: ['wordId', 'korean', 'translation', 'importance']
        },
        {
          UserWordHistory: [
            'averageScore',
            'highestScore',
            'isBookmark',
            'latestLearningAt',
            'bookmarkAt'
          ]
        }
      ]
    );

    return res.status(200).json({ success: true, words });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
