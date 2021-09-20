/**
    @description /learning/sentences/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { upload } from '../../utils/Multer';
import {
  evaluateUserVoice,
  recordPerfectVoiceCounts,
  recordUserVoiceCounts
} from './sentences.controller';

const sentencesRouter: Router = express.Router();

sentencesRouter.post(
  '/:sentenceId/evaluation',
  upload.single('userVoice'),
  evaluateUserVoice
); // 발화평가 요청
sentencesRouter.post('/:sentenceId(\\d+)/user-voice', recordUserVoiceCounts); // 사용자 음성 재생 기록
sentencesRouter.post(
  '/:sentenceId(\\d+)/perfect-voice',
  recordPerfectVoiceCounts
); // 성우 음성 재생 기록

export default sentencesRouter;
