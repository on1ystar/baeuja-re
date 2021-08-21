import * as express from 'express';

const app: express.Application = express.default();

const port: number = Number(process.env.PORT) || 4000;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('start');
});

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
