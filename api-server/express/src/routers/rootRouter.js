import express from 'express';

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
  res.send('<h2>Welcome to Peach API</h2>');
});

export default rootRouter;
