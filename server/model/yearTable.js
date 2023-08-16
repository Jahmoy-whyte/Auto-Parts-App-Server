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
