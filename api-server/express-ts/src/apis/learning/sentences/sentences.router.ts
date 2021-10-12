/**
    @description /learning/sentences/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { upload } from '../../../utils/Multer';
import {
  evaluateUserVoice,
  recordUserSentenceHistory
} from './sentences.controller';

const sentencesRouter: Router = express.Router();

sentencesRouter.post(
  '/:sentenceId(\\d+)/userSentenceHistory',
  recordUserSentenceHistory
); // 사용자 문장 학습 기록
sentencesRouter.post(
  '/:sentenceId/userSentenceEvaluation',
  upload.single('userVoice'),
  evaluateUserVoice
); // 발화평가 요청

export default sentencesRouter;
