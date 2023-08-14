import mysql2 from "mysql2/promise";

export const pool = mysql2.createPool({
  user: "root",
  host: "localhost",
  database: "autopartsdb",
});
