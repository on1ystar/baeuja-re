import express from 'express';
import helmet from 'helmet';
import morgan, { Morgan } from 'morgan';
import cors from 'cors';
import rootRouter from './routers/rootRouter';

const app: express.Application = express();
const logger = morgan('dev');
const port: number = Number(process.env.PORT) || 4000;

app.use(helmet()); // 보안 모듈
app.use(logger); // 로그 관리 모듈
app.use(express.urlencoded({ extended: true })); // url query prameter 파싱
app.use(cors()); // cors 모듈

app.use('/', rootRouter); // 루트 라우트

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
