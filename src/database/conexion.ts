import  config  from '../configs/env';
import pg from 'pg';
const {Pool} = pg

export const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: Number(config.db.port)
});


