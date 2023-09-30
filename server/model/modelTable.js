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

    model_id AS id,
    model.make_id AS makeId,
    make,
    model
     
    FROM model 
    JOIN make ON model.make_id = make.make_id
    ORDER BY model.make_id
    `
  );
  return result;
};

export const dbAddModel = async (makeId, model) => {
  const [result] = await pool.execute(
    `INSERT INTO model 
    (make_id , model) VALUES (?,?)`,
    [makeId, model]
  );
  return result.insertId;
};

export const dbUpdateModel = async (makeId, model, modelId) => {
  const [result] = await pool.execute(
    `UPDATE model SET make_id =? , model =? WHERE model_id =?`,
    [makeId, model, modelId]
  );
  return result;
};

export const dbDeleteModel = async (modelId) => {
  const [result] = await pool.execute(`DELETE FROM model WHERE model_id =?`, [
    modelId,
  ]);
  return result;
};
