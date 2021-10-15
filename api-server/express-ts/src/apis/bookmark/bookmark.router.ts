/*
    /bookmark/*
*/

import express, { Router } from 'express';
import {
  getBookmarkSentences,
  getBookmarkWords,
  postBookmarkSentence,
  postBookmarkWord
} from './bookmark.controller';

const bookmarkRouter: Router = express.Router();

bookmarkRouter.get('/sentences', getBookmarkSentences); // get bookmark sentences
bookmarkRouter.post('/sentences/:sentenceId(\\d+)', postBookmarkSentence); // add or remove sentence bookmark
bookmarkRouter.get('/words', getBookmarkWords); // get bookmark words
bookmarkRouter.post('/words/:wordId(\\d+)', postBookmarkWord); // add or remove word bookmark

export default bookmarkRouter;
