/*
    /users/*
*/

import express, { Router } from 'express';
import {
  deleteUser,
  getUserDetail,
  getUsers,
  patchtUserNickname
} from './users.controller';

const usersRouter: Router = express.Router();

usersRouter.get('/', getUsers); // get users list
usersRouter.get('/:userId(\\d+)', getUserDetail); // get user's detail
usersRouter.patch('/:userId(\\d+)', patchtUserNickname); // patch user's nickname
usersRouter.delete('/:userId(\\d+)', deleteUser); // delete a user

export default usersRouter;
