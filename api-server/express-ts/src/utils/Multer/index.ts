import multer from 'multer';

const storage = multer.memoryStorage();
// multer middleware for parsing file info from request
export const upload = multer({
  storage
  // fileFilter(req, file, cb) {}
});
