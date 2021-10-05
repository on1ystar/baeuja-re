/*
    /users/*
*/

import express, { Router } from 'express';
import { checkUserId } from '../../utils/Auth';
import {
  deleteUser,
  getUserDetail,
  getUsers,
  patchtUserNickname,
  postUser
} from './users.controller';

const usersRouter: Router = express.Router();

usersRouter.get('/', checkUserId, getUsers); // get users list
usersRouter.post('/', postUser); // post user(create or update)
usersRouter.get('/:userId(\\d+)', checkUserId, getUserDetail); // get user's detail
usersRouter.patch('/:userId(\\d+)', checkUserId, patchtUserNickname); // patch user's nickname
usersRouter.delete('/:userId(\\d+)', checkUserId, deleteUser); // delete a user

export default usersRouter;
