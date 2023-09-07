import { pool } from "../helper/databaseConnection.js";

export const dbGetNewArrival = async () => {
  const [result] = await pool.execute(
    `SELECT 

    product_id AS id,
    product_name AS productName,
    products.make_id AS makeId,
    products.model_id AS modelId,
    year_id	AS yearId,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    make.make,
    model.model

    FROM ((products 
    LEFT JOIN make ON  products.make_id = make.make_id)
    LEFT JOIN model ON  products.model_id = model.model_id)

    WHERE new_arrival= 'true'  LIMIT 5`
  );
  return result;
};

export const dbSearchForProducts = async (makeId, modelId, yearId) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,
    products.make_id AS makeId,
    products.model_id AS modelId,
    year_id	AS yearId,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    make.make,
    model.model

    FROM ((products 
    LEFT JOIN make ON  products.make_id = make.make_id)
    LEFT JOIN model ON  products.model_id = model.model_id)

    WHERE products.make_id=?  
    AND products.model_id =? 
    AND products.year_id=?`,
    [makeId, modelId, yearId]
  );
  return result;
};

export const dbSearchForProductWithCategory = async (
  makeId,
  modelId,
  yearId,
  subCategoryId
) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,
    products.make_id AS makeId,
    products.model_id AS modelId,
    year_id	AS yearId,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    make.make,
    model.model

    FROM ((products 
    LEFT JOIN make ON  products.make_id = make.make_id)
    LEFT JOIN model ON  products.model_id = model.model_id)

    WHERE products.make_id=?  
    AND products.model_id =? 
    AND products.year_id=? 
    AND products.subcategory_id =?`,
    [makeId, modelId, yearId, subCategoryId]
  );
  return result;
};

export const dbGetProductById = async (productId) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    make.make,
    model.model,
    year.year

    FROM products 
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id

    WHERE products.product_id =? LIMIT 1`,
    [productId]
  );
  return result;
};

export const dbProuductPagination = async (start) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    make.make,
    model.model,
    year.year

    FROM products 
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id

    WHERE product_id > ?
    
    ORDER BY product_id ASC

    LIMIT 10`,
    [start]
  );

  return result;
};
