/*
    /dev/user/*
*/

import express, { Router } from 'express';
import { createUser } from '../../controllers/dev/user.controller';

const userRouter: Router = express.Router();

userRouter.get('/', (req, res) => res.send('For User CRUD'));
userRouter.post('/', createUser);

export default userRouter;
