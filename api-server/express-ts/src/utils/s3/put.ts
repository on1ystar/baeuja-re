import { s3Client } from '.';
import conf from '../../config';
import { pool } from '../../db';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import wait from 'waait';

export const putContent = async () => {
  const queryResult = (
    await pool.query('SELECT word_id as "wordId", korean FROM word')
  ).rows;

  queryResult.forEach(async row => {
    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: conf.s3.bucketData,
          Key: `perfect-voice/words/${row.wordId}.wav`,
          Body: fs.readFileSync(
            `/Users/on1ystar/Documents/audio/words/${row.korean}.wav`
          )
        })
      );
    } catch (err) {
      console.log('Error', err);
    }
    await wait(50);
  });
};
