/**
    @description /learning/contents/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';
import { getLearningUnit } from './contents.controller';

const contentsRouter: Router = express.Router();

contentsRouter.get('/:contentId/units/:unitIndex', getLearningUnit);

export default contentsRouter;
