import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port: number =
  process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'
    ? 4001
    : 3000;

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`, port)
);
