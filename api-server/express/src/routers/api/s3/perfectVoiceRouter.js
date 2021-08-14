import express from 'express';
import {
  getPerfectVoice,
  getPerfectVoices
} from '../../../controllers/api/s3/perfectVoiceController';
import { middleAuth } from '../../../middlewares';

const perfectVoiceRouter = express.Router();

// get the perfect voices list
// api.k-peach.io/api/s3/perfect-voice
perfectVoiceRouter.get('/', middleAuth, getPerfectVoices);

// get a perfect voice
// api.k-peach.io/api/s3/perfect-voice/{name}
perfectVoiceRouter.get('/:name', middleAuth, getPerfectVoice);

export default perfectVoiceRouter;
