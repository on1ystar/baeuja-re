"use strict";
// db test
// import { dbPool } from './db';
// (async function () {
//   try {
//     const { rows } = await dbPool.query(
//       'SELECT * FROM users WHERE user_id = $1',
//       [1]
//     );
//     console.log(rows);
//   } catch (error) {
//     return console.error(error.stack);
//   }
// })();
// s3 test
// import {
//   ListObjectsCommand,
//   ListObjectsCommandInput,
//   ListObjectsCommandOutput
// } from '@aws-sdk/client-s3';
// import { s3Client } from './config/s3';
// import conf from './config';
// const PREFIX: string = 'perfect-voice';
// const bucketParams: ListObjectsCommandInput = {
//   Bucket: conf.bucket.data,
//   Prefix: PREFIX
// };
// (async function () {
//   try {
//     const perfectVoicesList = (
//       await s3Client.send(new ListObjectsCommand(bucketParams))
//     ).Contents;
//     console.log(perfectVoicesList);
//   } catch (error) {
//     return console.error('ListObjectsCommandOutput Error', error.stack);
//   }
// })();
//# sourceMappingURL=test.js.map