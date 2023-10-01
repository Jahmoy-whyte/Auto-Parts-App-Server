import { Router } from "express";
import {
  getAddress,
  addAddress,
  deleteAddress,
  searchForLocation,
} from "../controller/addressController.js";
import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";
import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import {
  ADMIN_AND_EMPLOYEE,
  USER_ONLY,
  USERS_AND_GUESTS,
} from "../helper/permission.js";

const Route = Router();

Route.get(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getAddress
);

Route.post(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  addAddress
);

Route.delete(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  deleteAddress
);

Route.get(
  "/search-for-location/:name",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  searchForLocation
);

export default Route;
