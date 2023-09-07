import { pool } from "../helper/databaseConnection.js";

export const dbEmployeeExist = async (email) => {
  const [result] = await pool.execute(
    `SELECT

    employee_id AS id,
    firstname AS firstName,
    lastname AS lastName,
    email,
    password,
    role AS userStatus
  
    FROM employee WHERE email=?`,
    [email]
  );
  return result;
};

export const dbCreateEmployeeAccount = async (
  firstName,
  lastName,
  email,
  hashedPassword,
  role
) => {
  const [result] = await pool.execute(
    `INSERT INTO employee (firstname , lastname, email , password , role)  VALUES(?,?,?,?,?)`,
    [firstName, lastName, email, hashedPassword, role]
  );
};

export const dbLogoutEmployee = async (userId, refreshToken) => {
  const [result] = await pool.execute(
    `DELETE FROM refresh_token WHERE user_id =? AND refresh_token=? `,
    [userId, refreshToken]
  );
};
