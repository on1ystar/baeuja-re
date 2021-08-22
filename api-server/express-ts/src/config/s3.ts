import AWS from 'aws-sdk';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Credentials } from '@aws-sdk/types';
import conf from './index';

// const awsConfig = new AWS.Config({
//   accessKeyId: conf.peachApi.accessKey,
//   secretAccessKey: conf.peachApi.secretKey,
//   region: conf.peachApi.region
// });

const credentials: Credentials = {
  accessKeyId: String(conf.peachApi.accessKey),
  secretAccessKey: String(conf.peachApi.secretKey)
};

export const s3Client: S3Client = new S3Client({
  credentials,
  region: conf.peachApi.region
});
