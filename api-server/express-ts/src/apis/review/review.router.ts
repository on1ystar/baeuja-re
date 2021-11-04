/*
    /review/*
*/

import express, { Router } from 'express';
import {
  getReviewWords,
  getReviewSentences,
  getLearningHistory
} from './review.controller';

const reviewRouter: Router = express.Router();

reviewRouter.get('/', getLearningHistory); // get user learning history counts
reviewRouter.get('/sentences', getReviewSentences); // get user sentences history list
reviewRouter.get('/words', getReviewWords); // get  user words history list

export default reviewRouter;
