/**
    @description /learning/words/*
    @version feature/api/PEAC-202-words-api
*/

import express, { Router } from 'express';
import { upload } from '../../../utils/Multer';
import {
  getLearningWord,
  getExampleSentences,
  evaluateUserVoice,
  recordUserWordHistory
} from './words.controller';

const wordsRouter: Router = express.Router();

wordsRouter.get('/:wordId(\\d+)', getLearningWord); // 학습 단어
wordsRouter.get('/:wordId(\\d+)/sentences', getExampleSentences); // 학습 단어가 포함된 예시 문장
wordsRouter.post(
  '/:wordId(\\d+)/userWordEvaluation',
  upload.single('userVoice'),
  evaluateUserVoice
); // 발화 평가 요청
wordsRouter.post('/:wordId(\\d+)/userWordHistory', recordUserWordHistory); // 사용자 단어 학습 기록 저장

export default wordsRouter;
