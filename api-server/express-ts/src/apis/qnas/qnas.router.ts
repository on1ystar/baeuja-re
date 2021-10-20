/*
    /qnas/*
*/

import express, { Router } from 'express';
import {
  answerQna,
  getQna,
  getQnas,
  getQnaTypes,
  postQna,
  remove
} from './qnas.controller';

const qnasRouter: Router = express.Router();

qnasRouter.get('/', getQnas); // 유저의 qnas list 조회
qnasRouter.post('/', postQna); // 유저가 qna 등록
qnasRouter.get('/:qnaId(\\d+)', getQna); // 유저의 qna 조회
qnasRouter.patch('/:qnaId(\\d+)', answerQna); // qna 답변
qnasRouter.delete('/:qnaId(\\d+)', remove); // qna 삭제
qnasRouter.get('/types', getQnaTypes); // qna 분류

export default qnasRouter;
