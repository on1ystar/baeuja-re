/**
    @description /learning/sentences/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { upload } from '../../utils/Multer';
import { evaluateUserVoice } from './sentences.controller';

const sentencesRouter: Router = express.Router();

sentencesRouter.post(
  '/:sentenceId/evaluation',
  upload.single('userVoice'),
  evaluateUserVoice
);

export default sentencesRouter;
