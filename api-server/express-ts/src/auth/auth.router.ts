/**
    @description /auth/*
    @version PEAC-131-guest-login
*/

import express, { Router } from 'express';
import { googleCallback, googleRequest, loginGuest } from './auth.controller';

const authRouter: Router = express.Router();

authRouter.get('/', (req, res) => res.send('For Auth App'));
authRouter.get('/google', googleRequest); // google oauth request
authRouter.get('/google/callback', googleCallback); // google redirection URI
authRouter.post('/guest', loginGuest); // for guest login

export default authRouter;
