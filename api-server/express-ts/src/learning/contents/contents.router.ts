/**
    @description /learning/contents/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { getLearningUnit } from './contents.controller';

const contentsRouter: Router = express.Router();

contentsRouter.get('/:contentId/units/:unitIndex', getLearningUnit); // 학습 유닛에 포함된 유닛, 문장, 단어 요청

export default contentsRouter;
