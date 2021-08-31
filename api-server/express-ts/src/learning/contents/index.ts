/**
    @description learning/contents App
    @version PEAC-161 get learning unit with sentences for main learning UI
*/

import express, { Application } from 'express';
import contentsRouter from './contents.router';

const contentsApp: Application = express();

contentsApp.use('/', contentsRouter);

export default contentsApp;
