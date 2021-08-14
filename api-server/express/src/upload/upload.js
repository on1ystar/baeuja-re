import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs/promises';
import { s3 } from '../config/s3';
import conf from '../config';

const upload = name => {
  const storage = multerS3({
    s3,
    bucket: conf.bucket.data,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key(req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    }
  });
};

export default upload;
