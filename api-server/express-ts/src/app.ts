/**
    @author 정성진(on1ystar)
    @email tjdwls0607@naver.com
    @version Beta-0.2 
    @copyright BAEUJA
    @script npm run build
    @description BAEUJA API SERVER ENTRY POINT
*/
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import usersApp from './apis/users';
import learningApp from './apis/learning';
import { checkUserId } from './utils/Auth';
import homeApp from './apis/home';
import bookmarkApp from './apis/bookmark';
import qnasApp from './apis/qnas';
import reviewApp from './apis/review';

const app: Application = express();
const logger = morgan('dev');
const swaggerSpec = YAML.load(
  path.join(
    __dirname,
    process.env.NODE_ENV === 'prod'
      ? '../build-prod/swagger.yaml'
      : '../build-dev/swagger.yaml'
  )
);

app.use(helmet()); // 보안 모듈
app.use(logger); // 로그 관리 모듈
app.use(express.json()); // request body parsing
app.use(express.urlencoded({ extended: true })); // url query prameter parsing
app.use(cors()); // cors 모듈

app.get('/', (req, res) => res.end());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // swagger로 작성한 파일 setup
app.use('/home', checkUserId, homeApp); // injecting home app
app.use('/users', usersApp); // injecting users app
app.use('/learning', checkUserId, learningApp); // injecting learning app
app.use('/bookmark', checkUserId, bookmarkApp); // injecting bookmark app
app.use('/review', checkUserId, reviewApp); // injecting review app
app.use('/qnas', checkUserId, qnasApp); // injecting qna app

export default app;
