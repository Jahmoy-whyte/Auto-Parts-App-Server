import { Router } from "express";

import {
  getSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controller/categoriesController.js";
const Route = Router();
import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";
import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import { ADMIN_AND_EMPLOYEE } from "../helper/permission.js";

Route.get("/", getSubCategory);

Route.post(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  addSubCategory
);

Route.patch(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  updateSubCategory
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  deleteSubCategory
);

export default Route;
