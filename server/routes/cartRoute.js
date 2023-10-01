import { Router } from "express";

import {
  getUserCart,
  addToCart,
  deleteCartItem,
  updateCartItem,
} from "../controller/cartController.js";
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
  getUserCart
);

Route.post(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  addToCart
);

Route.delete(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  deleteCartItem
);

Route.patch(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  updateCartItem
);

export default Route;
