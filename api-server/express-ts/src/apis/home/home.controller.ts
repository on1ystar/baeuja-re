/* eslint-disable no-console */
/** 
 @description home 페이지를 위한 컨트롤러
 @version PEAC-37-home-app
 */

import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import ContentRepository from '../../repositories/content.repository';
import SentenceWordRepository from '../../repositories/sentence-word.repository';
import UserRepository from '../../repositories/user.repository';
import WordRepository from '../../repositories/word.repository';
import NewContentsDTO from './dto/new-contents.dto';
import RecommendationsOfWordDTO from './dto/recommendationsOfWord.dto';

const NUM_OF_LAST_WORD_ID = 682;

// GET /home/contents
export const getNewContents = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userId: number = res.locals.userId;
  const client: PoolClient = await pool.connect();
  try {
    const contents: NewContentsDTO[] =
      await ContentRepository.joinUnitAndSentenceAndSentenceWord(client, [
        {
          Content: [
            'contentId',
            'classification',
            'title',
            'artist',
            'director',
            'thumbnailUri'
          ]
        }
      ]);
    await UserRepository.updateLatestLogin(client, userId);
    return res.status(200).json({ success: true, contents });
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

// GET /home/recommendations
export const getRecommendations = async (req: Request, res: Response) => {
  const client: PoolClient = await pool.connect();
  try {
    const min: number = Math.ceil(1);
    const max: number = Math.floor(NUM_OF_LAST_WORD_ID);
    const words = [];
    for (let i = 0; i < 5; i++) {
      const randomWordId: number =
        Math.floor(Math.random() * (max - min + 1)) + min;
      if (randomWordId === 334) continue;
      const word: RecommendationsOfWordDTO = {
        ...(await WordRepository.findOne(client, randomWordId, [
          'wordId',
          'korean',
          'translation',
          'importance'
        ])),
        sentences: await SentenceWordRepository.joinSentenceAndUnit(
          client,
          randomWordId,
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
            { SentenceWord: ['koreanInText', 'translationInText'] },
            { Unit: ['thumbnailUri'] }
          ]
        )
      };
      if (word.sentences.length === 0) continue;
      words.push(word);
    }
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
