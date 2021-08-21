import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rootRouter from './routers/rootRouter';

const app: express.Application = express();
const logger = morgan('dev');
const port: number = Number(process.env.PORT) || 4000;

app.use(helmet());
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', rootRouter); // 루트 라우트

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
