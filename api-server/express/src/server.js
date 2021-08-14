/*
- PrgName : server.js at peach-api  
- Date : 2021. 07. 18 
- Creator : 정성진 ( tjdwls0607@naver.com )
- Version : v1.0.0 
- Description : peach API back-end server 
- Usage 
1) startup : sudo npm run dev:server
2) build : sudo npm run build:server
3) pm2 for dev : sudo npm run pm2:dev
4) pm2 for product : sudo npm run pm2:prod
5) stop : ^c (or sudo pm2 stop all)
6) api-docs : sudo npm run api:docs
*/
import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import rootRouter from './routers/rootRouter';
import thumbnailRouter from './routers/api/s3/thumbnailRouter';
import perfectVoiceRouter from './routers/api/s3/perfectVoiceRouter';
import userVoiceRouter from './routers/api/s3/userVoiceRouter';
import adminRouter from './routers/api/auth/adminRouter';

const app = express();
const logger = morgan('dev');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

app.use(helmet());
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // 스웨거 문서 시작점 설정
app.use('/', rootRouter); // 루트 라우트
app.use('/api/s3/thumbnail', thumbnailRouter); // 썸네일 api 라우트
app.use('/api/s3/perfect-voice', perfectVoiceRouter); // 성우 음성 api 라우트
app.use('/api/s3/user-voice', userVoiceRouter); // 유저 음성 api 라우트
app.use('/api/auth/admin', adminRouter); // 관리자 인증 api 라우트

app.listen(4000, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
