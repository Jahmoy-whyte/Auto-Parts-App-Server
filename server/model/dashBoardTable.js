import { pool } from "../helper/databaseConnection.js";

export const dbGetDashBoardData = async () => {
  const data = [
    dbGetOrders(),
    dbGetSales(),
    dbAverageDailySales(),
    dbGetGuestToUserRatio(),
    dbGetProductCount(),
    dbGetNewOrdersCount(),
    dbGetNewUserThisMonth(),
    dbGetOutOfStockProducts(),
  ];
  const res = await Promise.all(data);
  console.log(res);
  return {
    orders: res[0],
    sales: res[1],
    averageDailySales: res[2],
    userRatio: res[3],
    productCount: res[4],
    newOrdersCount: res[5],
    newUserThisMonth: res[6],
    outOfStockProducts: res[7],
  };

  //   const sales = await dbGetSales();
  //   const averageDailySales = await dbAverageDailySales();
  //   const userRatio = await dbGetGuestToUserRatio();
  //   const productCount = await dbGetProductCount();
  //   const newOrdersCount = await dbGetNewOrdersCount();
  //   const wdd = await dbGetNewUserThisMonth();
  //   const dwd = await dbGetOutOfStockProducts();
};
// sales,
// averageDailySales,
// userRatio,
// productCount,
// newOrdersCount,
// wdd,
// dwd,
const dbGetSales = async () => {
  const [result] = await pool.execute(
    `
    SELECT shortend_months_name AS shortendMonthsName  , monthlySales.month ,
    
    CASE WHEN monthlySales.total IS NULL THEN 0  ELSE  monthlySales.total  END AS total

    FROM months 

    LEFT JOIN (

    SELECT
      MONTHNAME(date) AS month,	
      SUM(total) AS total
      FROM orders 
      WHERE YEAR(date) = YEAR(CURRENT_DATE)
      GROUP BY MONTH(date)	
     
      ) AS monthlySales


      ON months.month_name = monthlySales.month

      
      ORDER BY months.id
     
     `
  );
  return result;
};

const dbAverageDailySales = async () => {
  const [result] = await pool.execute(
    `SELECT
      AVG(total) AS average
      FROM orders 
     WHERE MONTH(date) = MONTH(CURRENT_DATE)
     `
  );
  return result[0].average;
};

const dbGetGuestToUserRatio = async () => {
  const [result] = await pool.execute(
    `
    SELECT
    MONTHNAME(date) AS month,
    COUNT(CASE WHEN user_status = 'user' THEN 1 END) AS userCount,
    COUNT(CASE WHEN user_status = 'guest' THEN 1 END) AS guestCount
    FROM users

    ;
    `
  );

  return result;
};

const dbGetProductCount = async () => {
  const [result] = await pool.execute(
    `
        SELECT
        COUNT(product_id) AS count
        FROM products
        `
  );
  return result[0].count;
};

const dbGetNewOrdersCount = async () => {
  const [result] = await pool.execute(
    `
    SELECT 
    COUNT(order_id) AS count
    FROM orders
    WHERE status = 'sent'
    `
  );
  return result[0].count;
};

const dbGetNewUserThisMonth = async () => {
  const [result] = await pool.execute(
    `
      SELECT 
      COUNT(user_id) AS count
      FROM users
      WHERE DATE(date) = CURRENT_DATE()
      `
  );
  return result[0].count;
};

const dbGetOutOfStockProducts = async () => {
  const [result] = await pool.execute(
    `
        SELECT 

        product_id AS id,
        product_name AS productName,
        subcategory_id AS subCategory,
        description,
        price,
        new_arrival	AS newArrival,
        condition_of_part AS conditionOfPart,
        image,
        status

        FROM products

        WHERE status = 'Out of stock'
        `
  );
  return result;
};

export const dbGetOrders = async () => {
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
      order_items_id AS orderItemsId,
      quantity
  
      FROM orders 
  
      LEFT JOIN order_items ON orders.order_id = order_items.order_id 
      LIMIT 5
      `
  );

  return result;
};
