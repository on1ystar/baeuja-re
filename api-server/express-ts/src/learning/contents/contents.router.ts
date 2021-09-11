/**
    @description /learning/contents/*
    @version feature/api/PEAC-38-learning-list-api
*/

import express, { Router } from 'express';
import {
  getContentDetail,
  getContents,
  getUnit,
  getUnits
} from './contents.controller';

const contentsRouter: Router = express.Router();

contentsRouter.get('/', getContents); // 학습 콘텐츠 리스트 요청
contentsRouter.get('/:contentId(\\d+)', getContentDetail); // 학습 콘텐츠 디테일(description) 요청
contentsRouter.get('/:contentId(\\d+)/units', getUnits); // 학습 콘텐트에 포함된 유닛 리스트 요청
contentsRouter.get('/:contentId(\\d+)/units/:unitIndex(\\d+)', getUnit); // 학습 유닛에 포함된 유닛, 문장, 단어 요청

export default contentsRouter;
