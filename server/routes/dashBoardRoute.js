import { Router } from "express";

import { getDashBoardData } from "../controller/dashBoardController.js";

import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import { ADMIN_ONLY } from "../helper/permission.js";

const Route = Router();

Route.get(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_ONLY),
  getDashBoardData
);

export default Route;
