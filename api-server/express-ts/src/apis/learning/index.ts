/**
    @description learning App
*/

import express, { Application } from 'express';
import contentsApp from './contents';
import learningRouter from './learning.router';
import sentencesApp from './sentences';
import wordsApp from './words';

const learningApp: Application = express();

learningApp.use('/', learningRouter);
learningApp.use('/contents', contentsApp); // injecting learning/contents app
learningApp.use('/sentences', sentencesApp); // injecting learning/sentences app
learningApp.use('/words', wordsApp); // injecting learning/words app

export default learningApp;
