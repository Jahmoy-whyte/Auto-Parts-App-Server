import { pool } from "../helper/databaseConnection.js";

export const dbGetModelBasedOnMakeId = async (makeId) => {
  const [result] = await pool.execute(
    `SELECT model ,
   model_id AS id 
   FROM model WHERE make_id=?`,
    [makeId]
  );
  return result;
};
