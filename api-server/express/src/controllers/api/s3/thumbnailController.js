import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../config/s3';
import conf from '../../../config';

const PREFIX = 'thumbnail';
const FORMAT = 'jpg';
const regex = /([^/]+)(\.[^./]+)$/g;

// rqeust로부터 S3에 저장된 썸네일 이미지 리스트 response
export const getThumbnails = async (req, res) => {
  const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };

  try {
    const thumbnailsList = await s3Client.send(
      new ListObjectsCommand(bucketParams)
    );
    const mappedThumbnails = thumbnailsList.Contents.map(el => {
      // bucket folder 예외처리
      if (el.Size === 0) {
        return {
          name: '',
          format: '',
          path: `${conf.bucket.data}/${el.Key}`,
          size: el.Size,
          lastModified: el.LastModified
        };
      }
      return {
        name: el.Key.match(regex)[0].split('.')[0],
        format: FORMAT,
        path: `${conf.bucket.data}/${el.Key}`,
        size: el.Size,
        lastModified: el.LastModified
      };
    });
    return res.json({ success: 'true', data: mappedThumbnails });
  } catch (err) {
    console.log('ListObjectsCommandError: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

// rqeust로부터 S3에 저장된 썸네일 1개 response
export const getThumbnail = async (req, res) => {
  const { name } = req.params;
  const bucketParams = {
    Bucket: conf.bucket.data,
    Key: `${PREFIX}/${name}.${FORMAT}`
  };

  try {
    const thumbnail = await s3Client.send(new GetObjectCommand(bucketParams));
    const formattedThumbnail = {
      name,
      format: FORMAT,
      path: `${conf.bucket.data}/${bucketParams.Key}`,
      size: thumbnail.ContentLength,
      lastModified: thumbnail.LastModified
    };
    return res.json({ success: 'true', data: formattedThumbnail });
  } catch (err) {
    console.log('GetObjectCommandError: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};
