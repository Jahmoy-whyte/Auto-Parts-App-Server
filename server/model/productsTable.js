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
    status,
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

export const dbGetProductByCategory = async (subCategoryId) => {
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
    status,
    image,
    make.make,
    model.model

    FROM ((products 
    LEFT JOIN make ON  products.make_id = make.make_id)
    LEFT JOIN model ON  products.model_id = model.model_id)

    WHERE subCategory_id= ?  LIMIT 5`,
    [subCategoryId]
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
    status,
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
    status,
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

export const dbUserGetProductById = async (productId, userId) => {
  const [result] = await pool.execute(
    `SELECT 
    products.product_id AS id,
    product_name AS productName,

    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    status,

    subcategories.subcategory_name AS subCategory,
    make.make,
    model.model,
    year.year,
    
    products.subcategory_id AS subCategoryId,
    products.make_id AS makeId,
    products.model_id AS modelId,
    products.year_id AS yearId,


    favorite_id  AS favoriteBool



    FROM products 


    

    LEFT JOIN favorite ON  products.product_id = favorite.product_id AND  favorite.user_id = ?
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id
    LEFT JOIN subcategories ON  products.subcategory_id = subcategories.subcategory_id


    WHERE products.product_id =? `,
    [userId, productId]
  );
  return result;
};

export const dbGetProductById = async (productId) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,

    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    image,
    status,

    subcategories.subcategory_name AS subCategory,
    make.make,
    model.model,
    year.year,
    
    products.subcategory_id AS subCategoryId,
    products.make_id AS makeId,
    products.model_id AS modelId,
    products.year_id AS yearId




    FROM products 

    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id
    LEFT JOIN subcategories ON  products.subcategory_id = subcategories.subcategory_id


    WHERE products.product_id =? LIMIT 1`,
    [productId]
  );
  return result;
};

export const dbProuductPagination = async (lastId) => {
  const [result] = await pool.execute(
    `SELECT 
    product_id AS id,
    product_name AS productName,
    subcategory_id AS subCategory,
    description,
    price,
    new_arrival	AS newArrival,
    condition_of_part AS conditionOfPart,
    status,
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
    [lastId]
  );

  return result;
};

export const dbCountProducts = async () => {
  const [result] = await pool.execute(
    `SELECT COUNT(product_id) AS numOfProducts FROM products`
  );
  return result;
};

export const dbGetProducts = async (start, limit) => {
  const [result] = await pool.execute(
    `SELECT 

    product_id AS id,
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

    subcategories.subcategory_name AS subCategory



    FROM products 
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id

    LEFT JOIN subcategories ON  products.subcategory_id = subcategories.subcategory_id

    LIMIT ${start}, ${limit}`,
    [start, limit]
  );
  return result;
};

export const dbSearchForProductsByText = async (text, filter) => {
  const newText = "%" + text + "%";
  const [result] = await pool.query(
    `SELECT 

    product_id AS id,
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

    subcategories.subcategory_name AS subCategory



    FROM products 
    LEFT JOIN make ON  products.make_id = make.make_id
    LEFT JOIN model ON  products.model_id = model.model_id
    LEFT JOIN year ON  products.year_id = year.year_id

    LEFT JOIN subcategories ON  products.subcategory_id = subcategories.subcategory_id




   WHERE ${filter} LIKE ?  LIMIT 15`,
    [newText]
  );
  return result;
};

export const dbAddProducts = async (body) => {
  const [result] = await pool.execute(
    `INSERT INTO products 
  
     (product_name,	
      make_id,
      model_id,	
      year_id,	
      subcategory_id,	
      description,	
      price,	
      new_arrival,	
      condition_of_part,	
      image,	
      status)
      
      VALUES(?,?,?,?,?,?,?,?,?,?,?)

    `,
    [
      body.productName,
      body.makeId,
      body.modelId,
      body.yearId,
      body.subCategoryId,
      body.description,
      body.price,
      body.newArrival,
      body.conditionOfPart,
      body.image,
      body.status,
    ]
  );
  return result;
};

export const dbUpdateProduct = async (body) => {
  const [result] = await pool.execute(
    `UPDATE products SET
  
     product_name =?,	
      make_id=?,
      model_id=?,	
      year_id=?,	
      subcategory_id=?,	
      description=?,	
      price=?,	
      new_arrival=?,	
      condition_of_part=?,	
      image=?,	
      status=?
      
      WHERE product_id = ?


    `,
    [
      body.productName,
      body.makeId,
      body.modelId,
      body.yearId,
      body.subCategoryId,
      body.description,
      body.price,
      body.newArrival,
      body.conditionOfPart,
      body.image,
      body.status,
      body.id,
    ]
  );
  return result;
};

export const dbDeleteProduct = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM products 
    WHERE product_id = ?
    `,
    [id]
  );
  return result;
};
