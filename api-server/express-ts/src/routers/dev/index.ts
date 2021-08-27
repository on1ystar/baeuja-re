/*
    /dev/*, 라우터들의 index 파일
*/
import express, { Router } from 'express';
import userRouter from './user.router';

const devRouter: Router = express.Router();

devRouter.use('/user', userRouter); // user CRUD를 위한 라우터

export default devRouter;
