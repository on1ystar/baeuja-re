/**
 * @description /home/*
 * @version PEAC-37-home-app
 */

import express, { Router } from 'express';
import { getNewContents, getRecommendations } from './home.controller';

const homeRouter: Router = express.Router();

homeRouter.get('/contents', getNewContents); // get new content
homeRouter.get('/recommendations', getRecommendations); // get recommendation sentences and words

export default homeRouter;
