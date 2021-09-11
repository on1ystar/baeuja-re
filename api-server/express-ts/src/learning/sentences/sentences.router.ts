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
);
sentencesRouter.post('/:sentenceId(\\d+)/user-voice', recordUserVoiceCounts);
sentencesRouter.post(
  '/:sentenceId(\\d+)/perfect-voice',
  recordPerfectVoiceCounts
);

export default sentencesRouter;
