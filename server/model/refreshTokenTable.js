import { pool } from "../helper/databaseConnection.js";

export const dbSaveRefreshToken = async (userId, refreshToken) => {
  const [result] = await pool.execute(
    `INSERT INTO refresh_token 
     (user_id ,refresh_token ,valid_until) VALUES(?,?,?)`,
    [userId, refreshToken, ""]
  );

  return result.insertId;
};

export const dbCompareRefreshToken = async (refreshToken) => {
  const [result] = await pool.execute(
    `SELECT * FROM refresh_token WHERE refresh_token =?`,
    [refreshToken]
  );

  return result.length > 0 ? true : false;
};
