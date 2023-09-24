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

export const dbGetModels = async () => {
  const [result] = await pool.execute(
    `SELECT

    model_id AS id 
    make_id AS makeId,
    model,
 
    FROM model `
  );
  return result;
};

export const dbAddModel = async (make) => {
  const [result] = await pool.execute(`INSERT INTO make (make) VALUES ?`, [
    make,
  ]);
  return result.insertId;
};

export const dbUpdateModel = async (makeId) => {
  const [result] = await pool.execute(
    `UPDATE make SET make =? WHERE make_id =?`,
    [makeId]
  );
  return result;
};

export const dbDeleteModel = async (makeId) => {
  const [result] = await pool.execute(`DELETE FROM make WHERE make_id =?`, [
    makeId,
  ]);
  return result;
};
