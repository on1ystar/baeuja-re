/**
    @description /auth/*
    @version PEAC-131-guest-login
*/

import express, { Router } from 'express';
import { loginGoogle, loginGuest } from './auth.controller';

const authRouter: Router = express.Router();

authRouter.get('/', (req, res) => res.send('For Auth App'));
authRouter.post('/google', loginGoogle); // for google login
authRouter.post('/guest', loginGuest); // for guest login

export default authRouter;
