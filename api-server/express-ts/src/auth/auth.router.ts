/**
    @description /auth/*
    @version feature/api/PEAC-36-auth-for-sign-iu-and-sign-up
*/

import express, { Router } from 'express';
import { googleCallback, googleRequest } from './auth.controller';

const authRouter: Router = express.Router();

authRouter.get('/', (req, res) => res.send('For Auth App'));
authRouter.get('/google', googleRequest); // googld oauth request
authRouter.get('/google/callback', googleCallback); // googld redirection URI

export default authRouter;
