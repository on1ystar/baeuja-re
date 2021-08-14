import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import multer from 'multer';
import axios from 'axios';
import dbClient from '../../../dbConnect';
import { s3Client } from '../../../config/s3';
import getNow from '../../../date';
import conf from '../../../config';
import { middleMulter } from '../../../middlewares';

const PREFIX = 'user-voice'; // S3 bucket 폴더
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g; // 파일 경로에서 파일 이름만 필터링
const AI_SERVER_URL = `http://${conf.peachAi.ip}`;

// request로부터 s3의 user-voice에 대한 리스트를 json으로 response
export const getUserVoices = async (req, res) => {
  const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };

  try {
    const userVoicesList = await s3Client.send(
      new ListObjectsCommand(bucketParams)
    );
    const mappedUserVoices = userVoicesList.Contents.map(el => {
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
    return res.json({ success: 'true', data: mappedUserVoices });
  } catch (err) {
    console.log('ListObjectsCommandError: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

// request로부터 s3의 user-voice 1개를 json으로 response
export const getUserVoice = async (req, res) => {
  const { name } = req.params;
  const bucketParams = {
    Bucket: conf.bucket.data,
    Key: `${PREFIX}/${name}.${FORMAT}`
  };

  try {
    const userVoice = await s3Client.send(new GetObjectCommand(bucketParams));
    const formattedUserVoice = {
      name,
      format: FORMAT,
      path: `${conf.bucket.data}/${bucketParams.Key}`,
      size: userVoice.ContentLength,
      lastModified: userVoice.LastModified
    };
    return res.json({ success: 'true', data: formattedUserVoice });
  } catch (err) {
    console.log('GetObjectCommandError: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

// s3에 user-voice 파일 업로드, 발음 평가 결과를 DB에 저장 후 response
export const uploadUserVoice = (req, res) => {
  middleMulter.single('uploadedFile')(req, res, async err => {
    // MulterError
    if (err instanceof multer.MulterError) {
      console.log('MulterError', err);
      return res
        .status(400)
        .json({ success: 'false', errorMessage: err.message });
    }
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: 'false', errorMessage: err.message });
    }
    // audio/wav format error
    // if (!(req.file.mimetype in ['audio/wav', 'audio/vnd.wave'])) {
    //   console.log('mimetypeError');
    //   return res.status(400).json({
    //     success: 'false',
    //     errorMessage: 'You should upload "audio/wav" of mimetype'
    //   });
    // }
    const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };
    try {
      // for userVoices counts
      const userVoices = await s3Client.send(
        new ListObjectsCommand(bucketParams)
      );
      // 예약어는 피하게 -> 코드에 의미 부여
      const date = getNow(); // 한국을 기준으로 현재 날짜 반환 'yyyy-mm-dd'

      const uploadParams = {
        Bucket: conf.bucket.data,
        Key: `${PREFIX}/${date}-${userVoices.Contents.length - 1}.${FORMAT}`,
        Body: req.file.buffer,
        ACL: 'public-read'
      };
      // S3에 user-voice 업로드
      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('Success upload');

      const url = `${AI_SERVER_URL}/evaluation`;
      const options = {
        method: 'POST',
        data: {
          format: FORMAT,
          path: `${conf.bucket.data}/${uploadParams.Key}`,
          size: req.file.size
        },
        url
      };
      // request to ai server
      try {
        const respondedData = (await axios(options)).data;
        if (!respondedData.success) {
          // 오류 코드 부여
          console.log('request fail');
          return res.status(400).json({ success: false, errorMessage: '' });
        }
        // data를 더 구제적으로
        console.log('Success response to ai-server', respondedData.data);

        const evaluatedUserVoice = {
          name: uploadParams.Key.match(regex)[0].split('.')[0],
          format: FORMAT,
          path: `${conf.bucket.data}/${uploadParams.Key}`,
          size: req.file.size,
          translatedSentence: respondedData.data.translatedSentence,
          score: respondedData.data.score
        };

        // db에 발음 평가 결과 저장
        try {
          const query = {
            name: 'insertUserVoiceEvaluation',
            text: 'INSERT INTO admin_voice VALUES(default, 1, $1, $2, $3, now())',
            values: [
              evaluatedUserVoice.path,
              evaluatedUserVoice.translatedSentence,
              evaluatedUserVoice.score
            ]
          };
          await dbClient.query(query);
        } catch (err) {
          console.log('selectAdminByEmailError: ', err.stack);
          return res.status(502).end();
        }
        return res.json({
          success: 'true',
          data: evaluatedUserVoice
        });
      } catch (error) {
        console.error('ReqeustToAIServerError: ', error.message);
      }
    } catch (err) {
      console.log('ListObjectsCommandError', err);
      return res
        .status(err.$metadata.httpStatusCode)
        .json({ success: 'false', errorMessage: err.message });
    }
  });
};
