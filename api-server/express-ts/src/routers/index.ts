/*
    /*, 모든 라우터들의 index 파일
*/
import express, { Request, Response, Router } from 'express';
import devRouter from './dev';

const indexRouter: Router = express.Router();

indexRouter.get(
  '/',
  (req: Request, res: Response): any =>
    res.send('<h2>Welcome to Peach API</h2>') // 루트 라우트
);
indexRouter.use('/dev', devRouter); // 개발을 위한 CRUD REST API 라우트

export default indexRouter;
