/*
  postgreSQL DB 접속 및 사용을 위한 connection 객체 생성
*/
import pg from 'pg';
import conf from './config';

const dbconfig: pg.ClientConfig = {
  host: conf.db.host,
  user: conf.db.user,
  password: conf.db.pw,
  database: conf.db.name,
  port: Number(conf.db.port),
  ssl: { rejectUnauthorized: false }
};
const dbClient: pg.Client = new pg.Client(dbconfig);

dbClient.connect((err: any): void => {
  if (err) {
    console.log('Failed to connect db ' + err);
  } else {
    console.log('Connect to db done!');
  }
});

export default dbClient;
