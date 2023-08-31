import { pool } from "../helper/databaseConnection.js";

export const dbInsertOrder = async (userId, address, total) => {
  const [result] = await pool.execute(
    `INSERT INTO orders (user_id, address, total)  VALUES(?,?,?)`,
    [userId, address, total]
  );
  return result.insertId;
};

export const dbInsertOrderItems = async (orderId, productsArray) => {
  const newProductsArray = productsArray.map((item) => {
    return [orderId, item.id, item.quantity];
  });

  const query =
    "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?";

  const [result] = await pool.query(query, [newProductsArray]);
};

export const dbDeleteCart = async (userId) => {
  const [result] = await pool.execute(`DELETE FROM cart WHERE user_id =?`, [
    userId,
  ]);
};

export const dbGetUserOrders = async (userId) => {
  const [result] = await pool.execute(
    `SELECT

    order_id AS id,	
    user_id	AS userId,
    address,	
    date,	
    total,	
    status
    FROM orders 

    WHERE user_id = ?`,
    [userId]
  );
  return result;
};
