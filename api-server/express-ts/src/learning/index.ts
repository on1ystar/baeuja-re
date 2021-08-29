/*
    version: PEAC-39-learning-unit-sentence-with-evaluation
*/

import express, { Application } from 'express';
import learningRouter from './learning.router';

const learningApp: Application = express();

learningApp.use('/', learningRouter);

export default learningApp;
