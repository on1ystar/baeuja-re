/**
    @description /learning/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/

import express, { Router } from 'express';

const learningRouter: Router = express.Router();

learningRouter.get('/', (req, res) => res.send('For Learning App'));

export default learningRouter;
