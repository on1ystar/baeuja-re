/* eslint-disable no-console */
/** 
 @description home 페이지를 위한 컨트롤러
 @version PEAC-37-home-app
 */

import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import ContentRepository from '../../repositories/content.repository';
import NewContentsDTO from './dto/new-contents.dto';

// GET /home/contents
export const getNewContents = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const client: PoolClient = await pool.connect();
  try {
    const contents: NewContentsDTO[] =
      await ContentRepository.joinUnitAndSentenceAndSentenceWord(client, [
        {
          Content: ['contentId', 'title', 'artist', 'director', 'thumbnailUri']
        }
      ]);
    return res.status(200).json({ success: true, contents });
  } catch (error) {
    console.log(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
