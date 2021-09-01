/**
    @description /
    @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/

import express, { Router } from 'express';

const appRouter: Router = express.Router();

appRouter.get('/', (req, res) => res.send('Hello BAEUJA API 🎉'));

export default appRouter;
