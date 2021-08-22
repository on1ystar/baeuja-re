import express from 'express';

const rootRouter: express.Router = express.Router();

rootRouter.get('/', (req: express.Request, res: express.Response): any => {
  res.send('<h2>Welcome to Peach API</h2>');
});

export default rootRouter;
