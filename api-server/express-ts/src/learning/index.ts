import express, { Application } from 'express';
import learningRouter from './learning.router';

const learningApp: Application = express();

learningApp.use('/', learningRouter);

export default learningApp;
