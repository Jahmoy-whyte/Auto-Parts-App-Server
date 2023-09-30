import { pool } from "../helper/databaseConnection.js";

export const dbGetYearBasedOnModelId = async (modelId) => {
  const [result] = await pool.execute(
    `SELECT year ,
   year_id AS id 
   FROM year WHERE model_id=?`,
    [modelId]
  );
  return result;
};

export const dbGetYears = async () => {
  const [result] = await pool.execute(
    `SELECT

    year_id AS id,
    year.model_id AS modelId,
    model,
    year
     
    FROM year 

    JOIN model ON year.model_id = model.model_id
    ORDER BY year.model_id
 
 `
  );
  return result;
};

export const dbAddYear = async (modelId, year) => {
  const [result] = await pool.execute(
    `INSERT INTO year (model_id , year) VALUES (?,?)`,
    [modelId, year]
  );
  return result.insertId;
};

export const dbUpdateYear = async (modelId, year, yearId) => {
  const [result] = await pool.execute(
    `UPDATE year SET model_id =? , year =? WHERE year_id =?`,
    [modelId, year, yearId]
  );
  return result;
};

export const dbDeleteYear = async (yearId) => {
  const [result] = await pool.execute(`DELETE FROM year WHERE year_id =?`, [
    yearId,
  ]);
  return result;
};
