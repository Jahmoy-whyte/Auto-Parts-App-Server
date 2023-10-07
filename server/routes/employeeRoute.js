import { Router } from "express";

import {
  signUp,
  login,
  logout,
  refreshToken,
  getAccount,
  countEmployees,
  getAllEmployees,
  employeeSearch,
  employeeUpdate,
  getEmployeeById,
  deleteEmployee,
  InvalidateRefreshtoken,
} from "../controller/employeeController.js";

import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import {
  ADMIN_AND_EMPLOYEE,
  ADMIN_ONLY,
  USERS_AND_GUESTS,
  USER_ONLY,
} from "../helper/permission.js";

const Route = Router();

Route.post("/login", login);
Route.post(
  "/signup",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  signUp
);

Route.post(
  "/logout",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  logout
);

Route.get(
  "/account",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getAccount
);

Route.get("/refreshtoken", refreshToken);

// Admin ============================================
Route.get(
  "/count-all-employees",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  countEmployees
);

Route.get(
  "/all-employees/:start/:end",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getAllEmployees
);

Route.get(
  "/employee-search/:filter/:searchText",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  employeeSearch
);

Route.patch(
  "/employee-update",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  employeeUpdate
);

Route.get(
  "/employee-by-id/:id",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getEmployeeById
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  deleteEmployee
);

Route.delete(
  "/invalidate-refresh-token/:id",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  InvalidateRefreshtoken
);

export default Route;
