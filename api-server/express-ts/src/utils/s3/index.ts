import { S3Client } from '@aws-sdk/client-s3';
import { Credentials } from '@aws-sdk/types';
import conf from '../../config';

// const awsConfig = new AWS.Config({
//   accessKeyId: conf.peachApi.accessKey,
//   secretAccessKey: conf.peachApi.secretKey,
//   region: conf.peachApi.region
// });

const credentials: Credentials = {
  accessKeyId: conf.peachApi.accessKey as string,
  secretAccessKey: conf.peachApi.secretKey as string
};

export const s3Client: S3Client = new S3Client({
  credentials,
  region: conf.peachApi.region
});
