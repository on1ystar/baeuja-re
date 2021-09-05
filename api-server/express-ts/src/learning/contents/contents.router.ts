/**
    @description /learning/contents/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { getUnit, getUnitList } from './contents.controller';

const contentsRouter: Router = express.Router();

contentsRouter.get('/:contentId(\\d+)/units', getUnitList); // 학습 콘텐트에 포함된 유닛 리스트 요청
contentsRouter.get('/:contentId(\\d+)/units/:unitIndex(\\d+)', getUnit); // 학습 유닛에 포함된 유닛, 문장, 단어 요청

export default contentsRouter;
