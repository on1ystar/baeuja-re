import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import UserSentenceHistoryRepository from '../../repositories/user-sentence-history.repository';
import UserWordHistoryRepository from '../../repositories/user-word-history.repository';

// GET /bookmark/sentences
export const getBookmarkSentences = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { sortBy, option } = req.query;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (
      (sortBy !== undefined &&
        sortBy !== 'latest_learning_at' &&
        sortBy !== 'bookmark_at') ||
      (option !== undefined && option !== 'DESC' && option !== 'ASC')
    )
      throw new Error("invalid query string's syntax");

    const sentences: any[] = await UserSentenceHistoryRepository.joinSentence(
      client,
      userId,
      sortBy === undefined ? 'bookmark_at' : sortBy, // default = bookmark_at
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
        { UserSentenceHistory: ['latestLearningAt', 'bookmarkAt'] }
      ]
    );

    return res.status(200).json({ success: true, sentences });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// POST /bookmark/sentences/:sentenceId
export const postBookmarkSentence = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId, timezone } = res.locals;
  const { sentenceId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

    await client.query(`SET TIME ZONE '${timezone}'`);

    const isBookmark: boolean =
      await UserSentenceHistoryRepository.updateIsBookmark(client, {
        userId,
        sentenceId: +sentenceId
      });
    return res.status(200).json({ success: true, isBookmark });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /bookmark/words
export const getBookmarkWords = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { sortBy, option } = req.query;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (
      (sortBy !== undefined &&
        sortBy !== 'latest_learning_at' &&
        sortBy !== 'bookmark_at') ||
      (option !== undefined && option !== 'DESC' && option !== 'ASC')
    )
      throw new Error("invalid query string's syntax");

    const words: any[] = await UserWordHistoryRepository.joinWord(
      client,
      userId,
      sortBy === undefined ? 'bookmark_at' : sortBy, // default = bookmark_at
      option === undefined ? 'DESC' : option, // default = DESC
      [
        {
          Word: ['wordId', 'korean', 'translation', 'importance']
        },
        { UserWordHistory: ['latestLearningAt', 'bookmarkAt'] }
      ]
    );

    return res.status(200).json({ success: true, words });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// POST /bookmark/words/:wordId
export const postBookmarkWord = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId, timezone } = res.locals;
  const { wordId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error("invalid params's syntax");

    await client.query(`SET TIME ZONE '${timezone}'`);

    const isBookmark: boolean =
      await UserWordHistoryRepository.updateIsBookmark(client, {
        userId,
        wordId: +wordId
      });
    return res.status(200).json({ success: true, isBookmark });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
