/*
    /learning/*
    version: PEAC-161 get learning unit with sentences for main learning UI
*/

import express, { Router } from 'express';
import { evaluateUserVoice, getLearningUnit } from './learning.controller';

const learningRouter: Router = express.Router();

learningRouter.get('/', (req, res) => res.send('For Learning App'));
learningRouter.get('/contents/:contentId/units/:unitIndex', getLearningUnit);
learningRouter.post('/sentences/:sentenceId/evaluation', evaluateUserVoice);

export default learningRouter;
