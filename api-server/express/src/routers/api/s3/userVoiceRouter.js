import express from 'express';
import {
  getUserVoice,
  getUserVoices,
  uploadUserVoice
} from '../../../controllers/api/s3/userVoiceController';
import { middleAuth } from '../../../middlewares';

const userVoiceRouter = express.Router();

// get the user voices list
// api.k-peach.io/api/s3/user-voice
userVoiceRouter.get('/', middleAuth, getUserVoices);

// get a user voice
// api.k-peach.io/api/s3/user-voice/{name}
userVoiceRouter.get('/:name', middleAuth, getUserVoice);

// upload a user voice
// api.k-peach.io/api/s3/user-voice/
userVoiceRouter.post('/', middleAuth, uploadUserVoice);

export default userVoiceRouter;
