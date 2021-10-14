/**
    @description learning/words App
    @version feature/api/PEAC-202-words-api
*/

import express, { Application } from 'express';
import wordsRouter from './words.router';

const wordsApp: Application = express();

wordsApp.use('/', wordsRouter);

export default wordsApp;
