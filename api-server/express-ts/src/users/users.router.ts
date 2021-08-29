/*
    /users/*
*/

import express, { Router } from 'express';
import { createUser } from './users.controller';

const usersRouter: Router = express.Router();

usersRouter.get('/', (req, res) => res.send('For Users App'));
usersRouter.post('/', createUser);

export default usersRouter;
