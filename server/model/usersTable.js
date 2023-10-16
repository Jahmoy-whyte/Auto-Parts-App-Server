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
    selected_address_id AS selectedAddressId,
    firstname AS firstName,
    lastname AS lastName,
    phone,

    address.address,
    address.place_type AS placeType,
    address_id AS addressId
    FROM users LEFT JOIN address ON  
    users.selected_address_id = address.address_id
    WHERE users.user_id=?`,
    [userId]
  );
  const [result2] = await pool.execute(
    `SELECT 
    cart_id AS id,
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

export const dbUpdateGuestToUser = async (userId, email, hashedpassword) => {
  const [result] = await pool.execute(
    `UPDATE users SET user_id=?, email=? ,password=? , user_status=?
    WHERE user_id =?
    `,
    [userId, email, hashedpassword, "user", userId]
  );

  console.log(result);
};

export const dbLogoutUser = async (userId, refreshToken) => {
  const [result] = await pool.execute(
    `DELETE FROM refresh_token
    WHERE user_id =? AND  refresh_token =?
    `,
    [userId, refreshToken]
  );
};

export const dbUpdateUser = async (firstName, lastName, phone, userId) => {
  const [result] = await pool.execute(
    `UPDATE users SET 
    
      firstname =?,
      lastname=?,
      phone=?
    
    WHERE user_id=?`,
    [firstName, lastName, phone, userId]
  );

  return result.affectedRows;
};

export const dbUpdateSelectedAddress = async (addressId, id) => {
  const [result] = await pool.execute(
    `UPDATE users SET 
     selected_address_id	 =?
     WHERE user_id=?`,
    [addressId, id]
  );

  return result.affectedRows;
};

export const dbGetAllUsers = async (start, end) => {
  const [result] = await pool.execute(
    `
  SELECT 
  
  users.user_id as id,
  user_status AS userStatus,
  emailverified AS emailVerified,
  selected_address_id  AS address_id,
  email,
  firstname AS firstName,
  lastname AS lastName,
  phone,
  address,	
  additional_info	AS additionalInfo,
  place_type AS placeType

  FROM users 

  LEFT JOIN address ON users.selected_address_id = address.address_id
  LIMIT ${end} OFFSET ${start}
  `
  );
  return result;
};

export const dbCountAllAccounts = async () => {
  const [result] = await pool.execute(
    `
  SELECT COUNT(user_id) AS count
  FROM users 
  `
  );
  return result[0];
};

export const dbUserSearch = async (filter, searchText) => {
  const likeText = "%" + searchText + "%";
  const [result] = await pool.execute(
    `
    SELECT 
    
    users.user_id as id,
    user_status AS userStatus,
    emailverified AS emailVerified,
    selected_address_id  AS address_id,
    email,
    firstname AS firstName,
    lastname AS lastName,
    phone,
    address,	
    additional_info	AS additionalInfo,
    place_type AS placeType
  
    FROM users 
  
    LEFT JOIN address ON users.selected_address_id = address.address_id
    WHERE ${filter} LIKE ?
    LIMIT 10
    `,
    [likeText]
  );

  return result;
};

/*


Full texts
user_id	
user_status	
email	
emailverified	
password	
firstname	
lastname	
phone	
selected_address_id
*/
export const dbAddUser = async (userData) => {
  const [result] = await pool.execute(
    `INSERT INTO users 
    (
      user_id	,
      user_status	,
      email	,
      emailverified,
      password	,
      firstname,	
      lastname,	
      phone	
    ) 
    
    VALUES(?,?,?,?,?,?,?,?)
    `,
    [
      userData.userId,
      userData.userStatus,
      userData.email,
      userData.emailVerified,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.phone,
    ]
  );
};

export const dbUserUpdate = async (userData) => {
  const [result] = await pool.execute(
    `UPDATE users SET 
    user_status=?		,
    email=?		,
    emailverified=?	,	
    firstname=?	,	
    lastname=?	,	
    phone	=?	
    WHERE user_id=?`,
    [
      userData.userStatus,
      userData.email,
      userData.emailVerified,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.userId,
    ]
  );

  return result;
};

export const dbDeleteUser = async (userId) => {
  const [result] = await pool.execute(`DELETE FROM users WHERE user_id = ?`, [
    userId,
  ]);

  return result;
};

export const dbGetUserById = async (userId) => {
  const [result] = await pool.execute(
    `
    SELECT 
    
    users.user_id as id,
    user_status AS userStatus,
    emailverified AS emailVerified,
    selected_address_id  AS address_id,
    email,
    firstname AS firstName,
    lastname AS lastName,
    phone,
    address,	
    additional_info	AS additionalInfo,
    place_type AS placeType
  
    FROM users 

    LEFT JOIN address ON users.selected_address_id = address.address_id
    WHERE users.user_id = ?
    `,
    [userId]
  );

  return result;
};

export const dbDeleteRefreshtoken = async (userId) => {
  const [result] = await pool.execute(
    `DELETE FROM refresh_token WHERE user_id = ?`,
    [userId]
  );

  return result;
};

export const dbSavePushToken = async (userId, expoPushToken) => {
  const [result] = await pool.execute(
    `INSERT INTO notification_tokens  (user_id, token) VALUES (?,?)
    `,
    [userId, expoPushToken]
  );
};

export const dbIfPushTokenExist = async (userId, expoPushToken) => {
  const [result] = await pool.execute(
    `SELECT * FROM notification_tokens  
    WHERE user_id =? AND token =?
    `,
    [userId, expoPushToken]
  );

  return result.length > 0;
};
