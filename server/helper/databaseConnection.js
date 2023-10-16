import mysql2 from "mysql2/promise";
import "dotenv/config";
export const pool = mysql2.createPool(process.env.DATABASE_URL);
