import express, { Application } from 'express';
import homeRouter from './home.router';

const homeApp: Application = express();

homeApp.use('/', homeRouter);

export default homeApp;
