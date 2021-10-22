import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port: number =
  process.env.NODE_ENV !== 'test'
    ? process.env.NODE_ENV !== 'dev'
      ? 3000
      : 3001
    : 3002;

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`, port)
);
