import express, { Application } from 'express';
import reviewRouter from './review.router';

const reviewApp: Application = express();

reviewApp.use('/', reviewRouter);

export default reviewApp;
