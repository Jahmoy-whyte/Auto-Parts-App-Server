import { pool } from "../helper/databaseConnection.js";

export const dbEmployeeExist = async (email) => {
  const [result] = await pool.execute(
    `SELECT

    employee_id AS id,
    firstname AS firstName,
    lastname AS lastName,
    email,
    password,
    role 
  
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

//====================================================================

/*

employee_id	
firstname	
lastname	
email	
password	
role

*/

export const dbGetAllEmployees = async (start, end) => {
  const [result] = await pool.execute(
    `
  SELECT 
  
  employee_id	AS id,
  firstname	AS firstName,
  lastname	AS lastName,
  email,	
  role
  
  FROM employee 

  LIMIT ? OFFSET ?
  `,
    [end, start]
  );
  return result;
};

export const dbCountEmployees = async () => {
  const [result] = await pool.execute(
    `
  SELECT COUNT(employee_id) AS count
  FROM employee 
  `
  );
  return result[0];
};

export const dbEmployeeSearch = async (filter, searchText) => {
  const likeText = "%" + searchText + "%";
  const [result] = await pool.execute(
    `
    SELECT 

    employee_id	AS id,
    firstname	AS firstName,
    lastname	AS lastName,
    email,	
    role
    
    FROM employee 

    WHERE ${filter} LIKE ?

    LIMIT 10
    `,
    [likeText]
  );

  return result;
};

export const dbEmployeeUpdate = async (employeeData) => {
  const [result] = await pool.execute(
    `UPDATE employee SET 
     
    firstname =?,
    lastname =?,
    email =?,	
    role =?

    WHERE employee_id=?`,
    [
      employeeData.firstName,
      employeeData.lastName,
      employeeData.email,
      employeeData.role,
      employeeData.employeeId,
    ]
  );

  return result;
};

export const dbDeleteEmployee = async (employeeId) => {
  const [result] = await pool.execute(
    `DELETE FROM employee WHERE employee_id = ?`,
    [employeeId]
  );

  return result;
};

export const dbGetEmployeeById = async (employeeId) => {
  const [result] = await pool.execute(
    `
    SELECT 

    employee_id	AS id,
    firstname	AS firstName,
    lastname	AS lastName,
    email,	
    role

    FROM employee

    WHERE employee_id=?`,

    [employeeId]
  );

  return result;
};
