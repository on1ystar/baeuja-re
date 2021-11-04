import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import conf from '../../../config';
import { pool } from '../../../db';
import { s3Client } from '../../../utils/s3';
import SentenceWordRepository from '../../../repositories/sentence-word.repository';
import UserWordEvaluationRepository, {
  UserWordEvaluationToBeSaved
} from '../../../repositories/user-word-evaluation.repository';
import UserWordHistoryRepository from '../../../repositories/user-word-history.repository';
import WordRepository from '../../../repositories/word.repository';
import ExampleSentencesDTO from './dto/example-sentences-dto';
import LearningWordDTO from './dto/learning-word.dto';
import PostWordToAIDTO, {
  WordOfPostWordToAIDTO
} from './dto/post-word-to-ai.dto';
import axios from 'axios';
import { MulterError } from 'multer';
import { UserWordHistoryPK } from '../../../entities/user-word-history.entity';

const AI_SERVER_URL = `http://${conf.peachAi.ip}`;
const S3_URL = `https://s3.${conf.s3.region}.amazonaws.com`;

// GET /learning/words/:wordId
export const getLearningWord = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId, timezone } = res.locals;
  const { wordId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error('invalid syntax of params');
    await client.query(`SET TIME ZONE '${timezone}'`);
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
    // 단어 학습 기록 저장
    if (
      await UserWordHistoryRepository.isExist(client, {
        userId,
        wordId: +wordId
      })
    ) {
      await UserWordHistoryRepository.updateCounts(client, {
        userId,
        wordId: +wordId
      });
    } else
      await UserWordHistoryRepository.save(client, { userId, wordId: +wordId });

    return res.status(200).json({ success: true, word });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
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
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// POST /learning/words/:wordId/userWordEvaluation
export const evaluateUserVoice = async (req: Request, res: Response) => {
  const { userId, timezone } = res.locals;
  const { wordId } = req.params;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error("invalid params's syntax");

    await client.query('BEGIN');
    await client.query(`SET TIME ZONE '${timezone}'`);

    // 사용자 음성 파일 s3 저장
    // 사용자가 요청한 단어의 발음 평가 기록 횟수
    const wordEvaluationCounts =
      await UserWordEvaluationRepository.getWordEvaluationCounts(
        client,
        userId,
        +wordId
      );
    const FORMAT: string = req.file?.originalname.split('.')[1] || 'wav';
    const Key = `user-voice/${userId}/words/${wordId}/${wordEvaluationCounts}.${FORMAT}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: conf.s3.bucketData,
        Key,
        Body: req.file?.buffer
        // ACL: 'public-read'
      })
    );
    console.info('✅ Success to upload userVoice file in S3--------------');

    // ai server에 보낼 PostWordToAI 인스턴스 생성
    const korean: string = (
      await WordRepository.findOne(client, +wordId, ['korean'])
    ).korean;
    const word: WordOfPostWordToAIDTO = {
      wordId: +wordId,
      korean,
      perfectVoiceUri: `${S3_URL}/${conf.s3.bucketData}/perfect-voice/words/${wordId}.wav`
    };
    const postWordToAI: PostWordToAIDTO = {
      userId: +userId,
      userVoiceUri: `${S3_URL}/${conf.s3.bucketData}/${Key}`,
      word
    };
    // responsed to ai server
    let {
      // eslint-disable-next-line prefer-const
      success,
      evaluatedWord, // eslint-disable-next-line prefer-const
      pitchData
    }: {
      success: boolean;
      evaluatedWord: { score: number; sttResult: string };
      pitchData: {
        perfectVoice: { hz: string; time: string };
        userVoice: { hz: string; time: string };
      };
    } = (
      await axios({
        method: 'post',
        url: `${AI_SERVER_URL}/evaluation/word`,
        data: {
          ...postWordToAI
        }
      })
    ).data;
    if (!success) throw new Error('fail to ai server rest communication');

    console.log(pitchData.perfectVoice.hz);

    // 소수점 6째 자리 이하 반올림
    if (pitchData.perfectVoice.hz.length !== 0) {
      const perfectVoiceHz = JSON.parse(pitchData.perfectVoice.hz).map(
        (t: number) => Math.round(t * 10 * 6) / (10 * 6)
      );
      const userVoiceHz = JSON.parse(pitchData.userVoice.hz).map(
        (t: number) => Math.round(t * 10 * 6) / (10 * 6)
      );
      pitchData.perfectVoice.hz = JSON.stringify(perfectVoiceHz);
      pitchData.userVoice.hz = JSON.stringify(userVoiceHz);
    }

    // 소수점 2째 자리 이하 반올림
    if (pitchData.perfectVoice.time.length !== 0) {
      const perfectVoiceTime = JSON.parse(pitchData.perfectVoice.time).map(
        (t: number) => Math.round(t * 100) / 100
      );
      const userVoiceTime = JSON.parse(pitchData.userVoice.time).map(
        (t: number) => Math.round(t * 100) / 100
      );
      pitchData.perfectVoice.time = JSON.stringify(perfectVoiceTime);
      pitchData.userVoice.time = JSON.stringify(userVoiceTime);
    }

    // 발음 평가 결과 DB 저장
    const userWordEvaluation: UserWordEvaluationToBeSaved = {
      userId,
      wordId: +wordId,
      wordEvaluationCounts,
      sttResult: evaluatedWord.sttResult,
      score: evaluatedWord.score,
      userVoiceUri: `${conf.s3.bucketDataCdn}/${Key}` // userVoiceUri for requesting to AI server
    };
    evaluatedWord = {
      ...evaluatedWord,
      ...(await UserWordEvaluationRepository.save(client, userWordEvaluation))
    };

    await client.query('COMMIT');

    return res.status(201).json({ success: true, evaluatedWord, pitchData });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof MulterError) console.log('❌ MulterError ');
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// POST /learning/words/:wordId/userWordHistory
export const recordUserWordHistory = async (req: Request, res: Response) => {
  const { userId, timezone } = res.locals;
  const { wordId } = req.params;
  const { column } = req.query;
  const client: PoolClient = await pool.connect();

  try {
    // request params 유효성 검사
    if (isNaN(+wordId)) throw new Error("invalid params's syntax");
    if (column !== 'perfectVoiceCounts' && column !== 'userVoiceCounts')
      throw new Error("invalid query string's syntax");

    await client.query(`SET TIME ZONE '${timezone}'`);

    const userWordHistoryPK: UserWordHistoryPK = {
      userId,
      wordId: +wordId
    };
    let wordHistory;
    // 성우 음성 재생 횟수 증가
    if (column === 'perfectVoiceCounts') {
      const perfectVoiceCounts =
        await UserWordHistoryRepository.updatePerfectVoiceCounts(
          client,
          userWordHistoryPK
        );
      wordHistory = {
        userId,
        wordId: +wordId,
        perfectVoiceCounts
      };
    }
    // 사용자 음성 재생 횟수 증가
    else {
      const userVoiceCounts =
        await UserWordHistoryRepository.updateUserVoiceCounts(
          client,
          userWordHistoryPK
        );
      wordHistory = {
        userId,
        wordId: +wordId,
        userVoiceCounts
      };
    }
    return res.status(201).json({
      success: true,
      wordHistory
    });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    if (errorMessage === 'TokenExpiredError')
      return res.status(401).json({ success: false, errorMessage });
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
