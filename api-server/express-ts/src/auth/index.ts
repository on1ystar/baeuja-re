/**
    @description auth App
    @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
*/

import express, { Application } from 'express';
import authRouter from './auth.router';

const authApp: Application = express();

authApp.use('/', authRouter);

export default authApp;
