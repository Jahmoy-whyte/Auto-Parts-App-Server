import { pool } from "../helper/databaseConnection.js";

export const dbGetUserCart = async (userId) => {
  const [result] = await pool.execute(
    `SELECT 
    cart_id AS id,	
    user_id AS userId,
    product_id AS productId,
    quantity, 	
    FROM cart WHERE user_id=?`,
    [userId]
  );
  return result;
};
