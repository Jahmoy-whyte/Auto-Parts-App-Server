import { Router } from "express";
import {
  notifyAllUsers,
  notifyUser,
} from "../controller/notificationController.js";
import { ADMIN_AND_EMPLOYEE } from "../helper/permission.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";

const Route = Router();

Route.post(
  "/notify-all",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  notifyAllUsers
);
Route.post(
  "/notify-user",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  notifyUser
);

export default Route;
