/*
    /users/*
*/

import express, { Router } from 'express';
import { deleteUser, getUsers } from './users.controller';

const usersRouter: Router = express.Router();

usersRouter.get('/', getUsers); // get users list
usersRouter.delete('/:userId(\\d+)', deleteUser); // delete a user

export default usersRouter;
