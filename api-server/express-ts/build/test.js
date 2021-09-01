"use strict";
// db test
// import { dbPool } from './db';
Object.defineProperty(exports, "__esModule", { value: true });
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
//     if (await UserUnitHistory.findOne(1, 2, 1)) {
//       await new UserUnitHistory(1, 2, 1).updateCounts();
//     } else await new UserUnitHistory(1, 2, 1).insert();
//   } catch (error) {
//     return console.error(error);
//   }
// })();
//# sourceMappingURL=test.js.map