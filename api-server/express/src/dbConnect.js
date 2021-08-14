/*
  postgreSQL DB 접속 및 사용을 위한 connection 객체 생성
*/
import pg from 'pg';
import conf from './config';

const dbconfig = {
  host: conf.db.host,
  user: conf.db.user,
  password: conf.db.pw,
  database: conf.db.name,
  port: conf.db.port,
  ssl: { rejectUnauthorized: false }
};
const dbClient = new pg.Client(dbconfig);

dbClient.connect(err => {
  if (err) {
    console.log('Failed to connect db ' + err);
  } else {
    console.log('Connect to db done!');
  }
});

export default dbClient;
