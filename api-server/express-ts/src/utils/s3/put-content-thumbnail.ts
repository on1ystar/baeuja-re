import { s3Client } from '.';
import conf from '../../config';
import { pool } from '../../db';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const putContentThumbnail = async () => {
  const queryResult = (await pool.query('SELECT content_id FROM content')).rows;
  queryResult.forEach(async row => {
    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: conf.bucket.data,
          Key: `thumbnail/contents/${String(row.content_id)}/units/`
        })
      );
      console.log('Success', data);
      return data; // For unit tests.
    } catch (err) {
      console.log('Error', err);
    }
  });
};
