import { pool } from "../helper/databaseConnection.js";

export const dbGetAddress = async (userId) => {
  const [result] = await pool.execute(
    `SELECT 

    address_id AS id,
    address,
    additional_info	 AS additionalInfo,
    place_type AS placeType,
    latitude,	
    longitude

    FROM address 

    WHERE user_id=?`,
    [userId]
  );

  return result;
};

export const dbAddAddress = async (
  userId,
  address,
  additionalInfo,
  placeType
) => {
  const [result] = await pool.execute(
    `INSERT INTO address 
    (user_id, address, additional_info, place_type)
     VALUES(?,?,?,?)`,
    [userId, address, additionalInfo, placeType]
  );
  return result.insertId;
};

export const dbDeleteAddress = async (addressId) => {
  const [result] = await pool.execute(
    `DELETE FROM address WHERE address_id =?`,
    [addressId]
  );
};

export const dbSearchForLocation = async (name) => {
  const newname = "%" + name + "%";
  const [result] = await pool.execute(
    `SELECT 

    objectId AS id,
      name 

      FROM list_cities_jamaica

      WHERE name LIKE ? LIMIT 10`,
    [newname]
  );

  return result;
};
