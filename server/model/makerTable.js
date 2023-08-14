import { pool } from "../helper/databaseConnection.js";

export const dbGetMake = async () => {
  const [result] = await pool.execute(`SELECT make , make_id AS id FROM make`);
  return result;
};

export const dbGetMakeInfo = async () => {
  const [result] = await pool.execute(
    `SELECT 

     make.make,
     make.make_id AS makeId,

     model.model,
     model.model_id AS ModelId,

     year.year,
     year.year_id AS yearId

    FROM make 
    LEFT JOIN model ON make.make_id = model.make_id
    LEFT JOIN year ON  model.model_id = year.year_id
    `
  );
  return result;
};
