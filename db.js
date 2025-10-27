import pg from 'pg'
import {DB_NAME, DB_PASSWORD, DB_USER,HOST, DB_PORT} from './config.js'

 const pool = new pg.Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: HOST,
  port: DB_PORT,
  database: DB_NAME,
  
})

export default pool;