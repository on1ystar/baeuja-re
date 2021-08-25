/*
  postgreSQL DB 접속 및 사용을 위한 connection pool 생성
  https://node-postgres.com/api/pool
*/
import pg from 'pg';
import conf from '../config';

const pool: pg.Pool = new pg.Pool({
  host: conf.db.host,
  user: conf.db.user,
  password: conf.db.pw,
  database: conf.db.name,
  port: Number(conf.db.port),
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  max: 7500
});

// 트랜잭션용
// export const dbPoolClient = (async function () {
//   try {
//     const client: pg.PoolClient = await pool.connect();
//     return client;
//   } catch (error) {
//     console.error('db connecting error: ', error.stack);
//     return error;
//   }
// })();

// db connect 확인
// (async function () {
//   try {
//     const client: pg.PoolClient = await pool.connect();
//     return console.log('db conneted !');
//   } catch (error) {
//     console.error('db connecting error: ', error.stack);
//     return error;
//   }
// })();

// 단일 쿼리 수행
export const dbPool = {
  query: (text: string, params: any[]) => pool.query(text, params)
};
