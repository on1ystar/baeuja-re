import express, { Application } from 'express';
import helmet from 'helmet';
import morgan, { Morgan } from 'morgan';
import cors from 'cors';
import indexRouter from './routers';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app: Application = express();
const port: number = Number(process.env.PORT) || 4000;
const logger = morgan('dev');
const swaggerSpec = YAML.load(path.join(__dirname, '../build/swagger.yaml'));

app.use(helmet()); // 보안 모듈
app.use(logger); // 로그 관리 모듈
app.use(express.json()); // request body parsing
app.use(express.urlencoded({ extended: true })); // url query prameter parsing
app.use(cors()); // cors 모듈

app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // swagger로 작성한 파일 setup

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
