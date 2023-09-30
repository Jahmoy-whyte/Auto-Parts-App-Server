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

export const dbAddSubCategory = async (category) => {
  const [result] = await pool.execute(
    `INSERT 
  INTO subcategories (subcategory_name) VALUES (?)`,
    [category]
  );
  return result.insertId;
};

/*
Full texts
subcategory_id	
category_id Ascending 1	
subcategory_name	
*/
export const dbUpdateSubCategory = async (categoryId, category) => {
  const [result] = await pool.execute(
    `UPDATE subcategories SET subcategory_name =? WHERE subcategory_id =?`,
    [category, categoryId]
  );
  return result;
};

export const dbDeleteSubCategory = async (categoryId) => {
  const [result] = await pool.execute(
    `DELETE FROM subcategories WHERE subcategory_id =?`,
    [categoryId]
  );
  return result;
};
