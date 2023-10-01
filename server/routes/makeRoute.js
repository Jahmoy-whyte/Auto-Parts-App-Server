import { Router } from "express";
import {
  getMake,
  getMakes,
  addMake,
  updateMake,
  deleteMake,
} from "../controller/makeController.js";

import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";
import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import {
  ADMIN_AND_EMPLOYEE,
  ADMIN_ONLY,
  USERS_AND_GUESTS,
  USER_ONLY,
} from "../helper/permission.js";

const Route = Router();

Route.get("/", userVerifyJwtToken, userIsPermitted(USERS_AND_GUESTS), getMake);

//Route.use(isPermitted(ADMIN_ONLY));
// employee =======================================================
Route.get(
  "/get",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getMakes
);

Route.post(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  addMake
);

Route.patch(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  updateMake
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  deleteMake
);

export default Route;
