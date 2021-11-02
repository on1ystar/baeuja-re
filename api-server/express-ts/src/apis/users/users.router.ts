/*
    /users/*
*/

import express, { Router } from 'express';
import { checkUserId } from '../../utils/Auth';
import {
  deleteUser,
  getLearningHistory,
  getUserDetail,
  getUsers,
  patchtUser,
  postUser
} from './users.controller';

const usersRouter: Router = express.Router();

usersRouter.get('/', checkUserId, getUsers); // get users list
usersRouter.post('/', postUser); // post user(create or update)
usersRouter.get('/:userId(\\d+)', checkUserId, getUserDetail); // get user's detail
usersRouter.patch('/:userId(\\d+)', checkUserId, patchtUser); // patch user's info
usersRouter.delete('/:userId(\\d+)', checkUserId, deleteUser); // delete a user
usersRouter.get(
  '/:userId(\\d+)/learning-history',
  checkUserId,
  getLearningHistory
); // get user's learning history

export default usersRouter;
