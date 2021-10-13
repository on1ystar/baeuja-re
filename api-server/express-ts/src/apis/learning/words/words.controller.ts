import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../../db';
import SentenceWordRepository from '../../../repositories/sentence-word.repository';
import WordRepository from '../../../repositories/word.repository';
import ExampleSentencesDTO from './dto/example-sentences-dto';
import LearningWordDTO from './dto/learning-word.dto';

// GET /learning/words/:wordId
export const getLearningWord = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userId: number = res.locals.userId;
  const { wordId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error('invalid syntax of params');

    // 학습 단어
    const word: LearningWordDTO = {
      ...(await WordRepository.leftJoinUserWordHistory(
        client,
        userId,
        +wordId,
        [
          {
            Word: [
              'wordId',
              'korean',
              'translation',
              'perfectVoiceUri',
              'importance'
            ]
          },
          { UserWordHistory: ['isBookmark'] }
        ]
      ))
    };
    return res.status(200).json({ success: true, word });
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /learning/words/:wordId/sentences
export const getExampleSentences = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userId: number = res.locals.userId;
  const { wordId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error('invalid syntax of params');

    // 학습 단어
    const sentences: ExampleSentencesDTO[] =
      await SentenceWordRepository.joinSentence(client, +wordId, [
        {
          Sentence: [
            'sentenceId',
            'contentId',
            'unitIndex',
            'koreanText',
            'translatedText'
          ]
        },
        { SentenceWord: ['koreanInText', 'translationInText'] }
      ]);
    return res.status(200).json({ success: true, sentences });
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// // POST /learning/words/:wordId/userWordEvaluation
// export const evaluateUserVoice = async (req: Request, res: Response) => {
//   const userId: number = res.locals.userId;
//   const { sentenceId } = req.params;
//   const client: PoolClient = await pool.connect();

//   try {
//     // request params 유효성 검사
//     if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");

//     await client.query('BEGIN');

//     // 사용자 음성 파일 s3 저장
//     // 사용자가 요청한 문장의 발음 평가 기록 횟수
//     const sentenceEvaluationCounts =
//       await UserSentenceEvaluationRepository.getSentenceEvaluationCounts(
//         client,
//         userId,
//         +sentenceId
//       );
//     const FORMAT: string = req.file?.originalname.split('.')[1] || 'wav';
//     const Key = `user-voice/${userId}/sentences/${sentenceId}/${sentenceEvaluationCounts}.${FORMAT}`;
//     await s3Client.send(
//       new PutObjectCommand({
//         Bucket: conf.s3.bucketData,
//         Key,
//         Body: req.file?.buffer
//         // ACL: 'public-read'
//       })
//     );
//     console.info('✅ Success S3 upload--------------');

//     // ai server에 보낼 PostEvaluationDTO 인스턴스 생성
//     const sentence: SentenceOfPostEvaluationDTO = {
//       sentenceId: +sentenceId,
//       koreanText: (
//         await SentenceRepository.findOne(client, +sentenceId, ['koreanText'])
//       ).koreanText as string,
//       perfectVoiceUri: `${S3_URL}/${conf.s3.bucketData}/perfect-voice/sentences/${sentenceId}.wav`
//     };
//     const postEvaluationDTO: PostEvaluationDTO = {
//       userId: +userId,
//       userVoiceUri: `${S3_URL}/${conf.s3.bucketData}/${Key}`,
//       sentence
//     };
//     // responsed to ai server
//     let {
//       // eslint-disable-next-line prefer-const
//       success,
//       evaluatedSentence, // eslint-disable-next-line prefer-const
//       pitchData
//     }: {
//       success: boolean;
//       evaluatedSentence: { score: number; sttResult: string };
//       pitchData: {
//         perfectVoice: { hz: string; time: string };
//         userVoice: { hz: string; time: string };
//       };
//     } = (
//       await axios({
//         method: 'post',
//         url: `${AI_SERVER_URL}/evaluation`,
//         data: {
//           ...postEvaluationDTO
//         }
//       })
//     ).data;
//     if (!success) throw new Error('fail to ai server rest communication');

//     // 발음 평가 결과 DB 저장
//     const userSentenceEvaluation: UserSentenceEvaluationToBeSaved = {
//       userId,
//       sentenceId: +sentenceId,
//       sentenceEvaluationCounts,
//       sttResult: evaluatedSentence.sttResult,
//       score: evaluatedSentence.score,
//       userVoiceUri: `${conf.s3.bucketDataCdn}/${Key}` // userVoiceUri for requesting to AI server
//     };
//     evaluatedSentence = {
//       ...evaluatedSentence,
//       ...(await UserSentenceEvaluationRepository.save(
//         client,
//         userSentenceEvaluation
//       ))
//     };

//     await client.query('COMMIT');

//     return res
//       .status(201)
//       .json({ success: true, evaluatedSentence, pitchData });
//   } catch (error) {
//     await client.query('ROLLBACK');

//     if (error instanceof MulterError) console.log('❌ MulterError ');
//     console.error(error);
//     const errorMessage = (error as Error).message;
//     return res.status(400).json({ success: false, errorMessage });
//   } finally {
//     client.release();
//   }
// };

// // POST /learning/words/:wordId/userWordHistory
// export const recordUserWordHistory = async (req: Request, res: Response) => {
//   const userId: number = res.locals.userId;
//   const { sentenceId } = req.params;
//   const { column } = req.query;
//   const client: PoolClient = await pool.connect();

//   try {
//     // request params 유효성 검사
//     if (isNaN(+sentenceId)) throw new Error("invalid params's syntax");
//     if (column !== 'perfectVoiceCounts' && column !== 'userVoiceCounts')
//       throw new Error("invalid query string's syntax");

//     const UserSentenceHistoryPK: UsersentenceHistoryPK = {
//       userId,
//       sentenceId: +sentenceId
//     };
//     let sentenceHistory;
//     // 성우 음성 재생 횟수 증가
//     if (column === 'perfectVoiceCounts') {
//       const perfectVoiceCounts =
//         await UserSentenceHistoryRepository.updatePerfectVoiceCounts(
//           client,
//           UserSentenceHistoryPK
//         );
//       sentenceHistory = {
//         userId,
//         sentenceId: +sentenceId,
//         perfectVoiceCounts
//       };
//     }
//     // 사용자 음성 재생 횟수 증가
//     else {
//       const userVoiceCounts =
//         await UserSentenceHistoryRepository.updateUserVoiceCounts(
//           client,
//           UserSentenceHistoryPK
//         );
//       sentenceHistory = {
//         userId,
//         sentenceId: +sentenceId,
//         userVoiceCounts
//       };
//     }
//     return res.status(201).json({
//       success: true,
//       sentenceHistory
//     });
//   } catch (error) {
//     console.error(error);
//     const errorMessage = (error as Error).message;
//     return res.status(400).json({ success: false, errorMessage });
//   } finally {
//     client.release();
//   }
// };
