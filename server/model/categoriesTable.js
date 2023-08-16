import { pool } from "../helper/databaseConnection.js";

export const dbGetSubCategory = async () => {
  const [result] = await pool.execute(
    `SELECT 
    subcategory_id AS id,
    subcategory_name AS category
   FROM subcategories`
  );
  return result;
};
