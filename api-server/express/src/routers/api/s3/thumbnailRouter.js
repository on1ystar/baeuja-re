import express from 'express';
import {
  getThumbnail,
  getThumbnails
} from '../../../controllers/api/s3/thumbnailController';
import { middleAuth } from '../../../middlewares';

const thumbnailRouter = express.Router();

// get images list
// api.k-peach.io/api/s3/thumbnail
thumbnailRouter.get('/', middleAuth, getThumbnails);

// get a image
// api.k-peach.io/api/s3/thumbnail/{name}
thumbnailRouter.get('/:name', middleAuth, getThumbnail);

export default thumbnailRouter;
