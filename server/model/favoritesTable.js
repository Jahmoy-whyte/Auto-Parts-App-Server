import { pool } from "../helper/databaseConnection.js";

export const dbGetFavorites = async (userId) => {
  const product = `
  products.product_id AS id,
    product_name AS productName,
    products.make_id AS makeId,
    products.model_id AS modelId,
    products.year_id	AS yearId,
    products.subcategory_id AS subCategoryId,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    status,


    make.make,
    model.model,
    year.year,

    subcategories.subcategory_name AS subCategory`;

  const [result] = await pool.execute(
    `SELECT 

    favorite_id AS	favoriteId,
  
    ${product}

    FROM favorite 
   

    LEFT JOIN products ON  favorite.product_id = products.product_id 
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id
    LEFT JOIN subcategories ON  products.subcategory_id = subcategories.subcategory_id
   
   
   
   WHERE user_id=?`,
    [userId]
  );
  return result;
};

export const dbAddFavorite = async (userId, product_id) => {
  const [result] = await pool.execute(
    `INSERT INTO 
     favorite (user_id,product_id)
     VALUES (?,?)`,
    [userId, product_id]
  );
  return result;
};

export const dbDeleteFavorite = async (productId, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM favorite WHERE product_id =? AND user_id =?`,
    [productId, userId]
  );
  return result;
};
