import express, { Application } from 'express';
import usersRouter from './users.router';

const usersApp: Application = express();

usersApp.use('/', usersRouter);

export default usersApp;
