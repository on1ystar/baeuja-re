/**
    @version PEAC-161 get learning unit with sentences for main learning UI
*/

import express, { Application } from 'express';
import learningRouter from './learning.router';

const learningApp: Application = express();

learningApp.use('/', learningRouter);

export default learningApp;
