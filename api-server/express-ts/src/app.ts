/**
    @author 정성진(on1ystar)
    @email tjdwls0607@naver.com
    @version 1.0
    @copyright BAEUJA
    @script npm run build
    @script npm run pm2:start
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

const app: Application = express();
const logger = morgan('dev');
const swaggerSpec = YAML.load(path.join(__dirname, '../build/swagger.yaml'));

app.use(helmet()); // 보안 모듈
app.use(logger); // 로그 관리 모듈
app.use(express.json()); // request body parsing
app.use(express.urlencoded({ extended: true })); // url query prameter parsing
app.use(cors()); // cors 모듈

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // swagger로 작성한 파일 setup
app.use('/home', checkUserId, homeApp); // injecting home app
app.use('/users', usersApp); // injecting users app
app.use('/learning', checkUserId, learningApp); // injecting learning app
app.use('/bookmark', checkUserId, bookmarkApp); // injecting learning app

export default app;
