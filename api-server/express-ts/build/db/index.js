"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
/*
  postgreSQL DB 접속 및 사용을 위한 connection pool 생성
  https://node-postgres.com/api/pool
*/
var pg_1 = __importDefault(require("pg"));
var config_1 = __importDefault(require("../config"));
exports.pool = new pg_1.default.Pool({
    host: config_1.default.db.host,
    user: config_1.default.db.user,
    password: config_1.default.db.pw,
    database: config_1.default.db.name,
    port: Number(config_1.default.db.port),
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
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
//# sourceMappingURL=index.js.map