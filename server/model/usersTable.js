import { pool } from "../helper/databaseConnection.js";

export const dbUserExist = async (email) => {
  const [result] = await pool.execute(`SELECT * FROM users WHERE email=?`, [
    email,
  ]);
  return result.length > 0 ? true : false;
};

export const dbCreateUser = async (
  userId,
  email,
  hashedpassword,
  userStatus
) => {
  const [result] = await pool.execute(
    `INSERT INTO users (user_id , email ,password , user_status) VALUES(?,?,?,?)
    `,
    [userId, email, hashedpassword, userStatus]
  );
};

export const dbGetUser = async (email) => {
  const [result] = await pool.execute(
    `SELECT 
    user_id as id,
    user_status AS userStatus,
    emailverified AS emailVerified,
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

export const dbLoggedInUserInfo = async (userId) => {
  const [result1] = await pool.execute(
    `SELECT 
    users.user_id as id,
    user_status AS userStatus,
    emailverified AS emailVerified,
    email,
    firstname,
    lastname,
    phone
    FROM users WHERE users.user_id=?`,
    [userId]
  );
  const [result2] = await pool.execute(
    `SELECT 
    cart_id AS cartId,
    product_id	AS productId,
    quantity 
    FROM cart WHERE user_id=?`,
    [userId]
  );

  if (result1.length > 0) {
    result1[0].cart = result2;
    return result1[0];
  }
  return [];
};
