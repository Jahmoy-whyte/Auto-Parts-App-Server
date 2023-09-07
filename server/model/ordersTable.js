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
    return [orderId, item.productId, item.quantity];
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

export const dbGetUserOrderDetail = async (orderId) => {
  const products = `
  products.product_id AS productId,
  product_name AS productName,
  make_id AS makeId,
  model_id AS modelId,
  subcategory_id AS subCategory,
  description,
  price,
  new_arrival	AS newArrival,
  condition_of_part AS conditionOfPart,
  image`;

  const [result1] = await pool.execute(
    `SELECT
    
    orders.order_id AS id,	
    user_id	AS userId,
    address,	
    date,	
    total,	
    status

    FROM orders 
    WHERE orders.order_id  = ?`,
    [orderId]
  );

  const [result2] = await pool.execute(
    `SELECT

    order_items_id AS id,
    quantity,
    ${products}

    FROM order_items 
    LEFT JOIN products ON products.product_id = order_items.product_id
    WHERE order_items.order_id  = ?`,
    [orderId]
  );

  if (result1.length < 1) return [];

  result1[0].items = result2;
  return result1;
};

export const dbGetAllOrders = async () => {
  const products = `
  products.product_id AS productId,
  product_name AS productName,
  make_id AS makeId,
  model_id AS modelId,
  subcategory_id AS subCategory,
  description,
  price,
  new_arrival	AS newArrival,
  condition_of_part AS conditionOfPart,
  image`;

  const [result] = await pool.execute(
    `SELECT
    
    orders.order_id AS id,	
    user_id	AS userId,
    address,	
    date,	
    total,	
    status,
    order_items_id AS id,
    quantity

    FROM orders 

    LEFT JOIN order_items ON orders.order_id = order_items.order_id`
  );

  return result;
};
