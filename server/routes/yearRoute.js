import { Router } from "express";
import { ADMIN_AND_EMPLOYEE, ADMIN_ONLY } from "../helper/permission.js";

import {
  addYear,
  deleteYear,
  getYearBasedOnModelId,
  getYears,
  updateYear,
} from "../controller/yearController.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import verifyJwtEmployeeToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
const Route = Router();

Route.use(verifyJwtEmployeeToken);
Route.use(employeeIsPermitted(ADMIN_AND_EMPLOYEE));

Route.get("/:modelId", getYearBasedOnModelId);

Route.get("/", getYears);

Route.post("/", addYear);

Route.patch("/", updateYear);

Route.delete("/", deleteYear);

export default Route;
