import express, { Application } from 'express';
import qnasRouter from './qnas.router';

const qnasApp: Application = express();

qnasApp.use('/', qnasRouter);

export default qnasApp;
