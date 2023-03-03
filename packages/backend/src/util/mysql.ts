import mysql from 'serverless-mysql';

export const mysqlConn = mysql({
  config: {
    host: process.env.RDS_INSTANCE_ENDPOINT || process.env.MYSQL_ENDPOINT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
});

export const { query } = mysqlConn;
export const { transaction } = mysqlConn;
