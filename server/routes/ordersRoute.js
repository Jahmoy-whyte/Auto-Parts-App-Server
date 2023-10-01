import { Router } from "express";

import {
  insertOrders,
  getUserOrders,
  getUserOrderDetail,
  getAllOrders,
  ordersCount,
  getOrdersOnCondition,
  ordersSearch,
  updateOrderStatus,
  deleteOrders,
} from "../controller/ordersController.js";
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

Route.post("/", userVerifyJwtToken, userIsPermitted(USER_ONLY), insertOrders);

Route.get("/", userVerifyJwtToken, userIsPermitted(USER_ONLY), getUserOrders);

Route.get(
  "/:id",
  userVerifyJwtToken,
  userIsPermitted(USER_ONLY),
  getUserOrderDetail
);
//employee ==============================================================================
Route.get(
  "/orders/get",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getAllOrders
);

Route.get(
  "/orders/count-orders",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  ordersCount
);

Route.get(
  "/orders/get/:status/:start/:limit",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getOrdersOnCondition
);

Route.get(
  "/orders/search/:status/:filter/:searchText",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  ordersSearch
);

Route.patch(
  "/update/status",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  updateOrderStatus
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  deleteOrders
);

export default Route;

/*


Route.get("/orders/sales", async (req, res, next) => {
  try {
    const sales = await dbGetSales();
    res.status(200).json({ res: sales, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.get("/orders/average-daily-sales", async (req, res, next) => {
  try {
    const average = await dbAverageDailySales();
    res.status(200).json({ res: average[0], status: "ok" });
  } catch (error) {
    next(error);
  }
});
*/
