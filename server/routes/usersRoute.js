import { Router } from "express";

import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";

import {
  USERS_AND_GUESTS,
  USER_ONLY,
  ADMIN_AND_EMPLOYEE,
  ADMIN_ONLY,
} from "../helper/permission.js";

import {
  signup,
  convertGuestToUser,
  countAllAccounts,
  createGuestAccount,
  createUserAccount,
  deleteUser,
  getUserById,
  getUsers,
  getUsersBySearch,
  login,
  logout,
  getAccountInfo,
  updateAccount,
  updateSelectedAddress,
  updateUserAccount,
  InvalidateRefreshtoken,
} from "../controller/userController.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";

const Route = Router();

Route.post("/signup", signup);

Route.post("/login", login);

Route.post("/login/guest", createGuestAccount); // change  login to sign up

Route.post(
  "/guest-to-user-signup", // change to convert-Guest-To-User
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  convertGuestToUser
);

Route.post(
  "/logout",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  logout
);

/* 
=============================================================================================
=============================== not login or signup related =================================
=============================================================================================
*/

Route.get(
  "/", // this is where the login users get there account infomation
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getAccountInfo
);

// this is where users update their account infomation
Route.patch("/", userVerifyJwtToken, userIsPermitted(USER_ONLY), updateAccount);

Route.patch(
  "/selected-address",
  userVerifyJwtToken,
  userIsPermitted(USER_ONLY),
  updateSelectedAddress
);

/* 
=============================================================================================
=============================== for dashboard use =================================
=============================================================================================
*/

// use for the dashbord to count total accounts regardless of users status
Route.get(
  "/count-all-users",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  countAllAccounts
);

Route.get(
  "/all-users/:start/:end",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getUsers
);

Route.get(
  "/user-search/:filter/:searchText",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getUsersBySearch
);

Route.post(
  "/user-add",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  createUserAccount
);
// for
Route.patch(
  "/user-update",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  updateUserAccount
);

Route.get(
  "/user-by-id/:id",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getUserById
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  deleteUser
);

Route.delete(
  "/invalidate-refresh-token/:id",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  InvalidateRefreshtoken
);

export default Route;
