/**
 * @description /home/*
 * @version PEAC-37-home-app
 */

import express, { Router } from 'express';
import { getNewContents } from './home.controller';

const homeRouter: Router = express.Router();

homeRouter.get('/contents', getNewContents); // get new content

export default homeRouter;
