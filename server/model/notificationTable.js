import { pool } from "../helper/databaseConnection.js";

export const dbGetAllNotificationToken = async () => {
  const [result] = await pool.execute(`SELECT token FROM notification_tokens`);
  return result;
};

export const dbGetUserNotificationToken = async (userId) => {
  const [result] = await pool.execute(
    `SELECT token FROM notification_tokens WHERE user_id = ?`,
    [userId]
  );
  return result;
};
