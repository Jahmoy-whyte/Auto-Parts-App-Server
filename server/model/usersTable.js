import { pool } from "../helper/databaseConnection.js";

export const dbUserExist = async (email) => {
  const [result] = await pool.execute(`SELECT * FROM users WHERE email=?`, [
    email,
  ]);
  return result.length > 0 ? true : false;
};

export const dbCreateUser = async (userId, email, hashedpassword) => {
  const [result] = await pool.execute(
    `INSERT INTO users (user_id , email ,password) VALUES(?,?,?)
    `,
    [userId, email, hashedpassword]
  );
};

export const dbGetUser = async (email) => {
  const [result] = await pool.execute(
    `SELECT 
    user_id as id,
    email,
    password,
    firstname,
    lastname,
    phone
     FROM users WHERE email=?`,
    [email]
  );
  return result;
};