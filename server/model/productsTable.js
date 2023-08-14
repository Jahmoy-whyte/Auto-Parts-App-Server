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
