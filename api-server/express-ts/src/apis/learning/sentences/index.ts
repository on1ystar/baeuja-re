/**
    @description learning/sentences App
    @version PEAC-161 get learning unit with sentences for main learning UI
*/

import express, { Application } from 'express';
import sentencesRouter from './sentences.router';

const sentencesApp: Application = express();

sentencesApp.use('/', sentencesRouter);

export default sentencesApp;
