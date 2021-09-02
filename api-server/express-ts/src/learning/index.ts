/**
    @description learning App
*/

import express, { Application } from 'express';
import contentsApp from './contents';
import learningRouter from './learning.router';
import sentencesApp from './sentences';

const learningApp: Application = express();

learningApp.use('/', learningRouter);
learningApp.use('/contents', contentsApp); // injecting learning/contents app
learningApp.use('/sentences', sentencesApp); // injecting learning/sentences app

export default learningApp;
