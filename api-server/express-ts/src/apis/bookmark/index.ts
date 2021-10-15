import express, { Application } from 'express';
import bookmarkRouter from './bookmark.router';

const bookmarkApp: Application = express();

bookmarkApp.use('/', bookmarkRouter);

export default bookmarkApp;
