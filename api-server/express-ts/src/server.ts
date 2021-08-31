import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port: number = process.env.RUN === 'dev' ? 4001 : 3000;

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`, port)
);
