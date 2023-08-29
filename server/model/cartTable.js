import { pool } from "../helper/databaseConnection.js";

export const dbGetUserCart = async (userId) => {
  const [result] = await pool.execute(
    `SELECT 
    cart.cart_id AS id,	
    cart.product_id AS productId,
    quantity,

    product_name AS productName,
    price,
    image

    FROM cart LEFT JOIN 
    products ON cart.product_id = products.product_id

    WHERE cart.user_id=?`,
    [userId]
  );

  return result;
};

export const dbAddToCart = async (userId, productId, quantity) => {
  const [result] = await pool.execute(
    `INSERT INTO cart (user_id , product_id ,quantity)
     VALUES(?,?,?)`,
    [userId, productId, quantity]
  );
  return result.insertId;
};

export const dbDeleteCartItem = async (cartId) => {
  const [result] = await pool.execute(`DELETE FROM cart WHERE cart_id =?`, [
    cartId,
  ]);
};

export const dbUpdateCartItem = async (quantity, cartId) => {
  const [result] = await pool.execute(
    `UPDATE cart SET quantity=? WHERE cart_id =?`,
    [quantity, cartId]
  );
};
