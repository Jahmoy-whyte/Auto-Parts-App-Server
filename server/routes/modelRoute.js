import { Router } from "express";
import {
  getModelBasedOnMakeId,
  getModel,
  addModel,
  updateModel,
  deleteModel,
} from "../controller/modelController.js";
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

Route.get(
  "/:makeId",

  getModelBasedOnMakeId
);

//Route.use(isPermitted(ADMIN_ONLY));
// employee =====================================================================
Route.get(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getModel
);

Route.post(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  addModel
);

Route.patch(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  updateModel
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  deleteModel
);

export default Route;
