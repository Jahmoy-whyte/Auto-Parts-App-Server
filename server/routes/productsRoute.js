import { Router } from "express";

import {
  getNewArrival,
  getProductsByAttributes,
  getProductsByAttributesAndCategory,
  getProductById,
  prouductPagination,
  countProducts,
  getProducts,
  searchForProductsByText,
  addProducts,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import employeeVerifyJwtToken from "../middleware/employee-middle-ware/employeeVerifyJwtToken.js";
import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";
import employeeIsPermitted from "../middleware/employee-middle-ware/employeeIsPermitted.js";
import {
  ADMIN_AND_EMPLOYEE,
  ADMIN_ONLY,
  USERS_AND_GUESTS,
  USER_ONLY,
} from "../helper/permission.js";

const Route = Router();

Route.get(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getNewArrival
);

Route.get(
  "/:makeId/:modelId/:yearId",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getProductsByAttributes
);

Route.get(
  "/:makeId/:modelId/:yearId/:subCategoryId",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getProductsByAttributesAndCategory
);

// employee=============================================================
Route.get(
  "/:productId",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getProductById
);

Route.get(
  "/pagination/:lastId",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  prouductPagination
);

Route.get(
  "/product/count",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  countProducts
);

Route.get(
  "/products/get",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  getProducts
);

Route.get(
  "/products/search",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  searchForProductsByText
);

Route.post(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  addProducts
);

Route.put(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  updateProduct
);

Route.delete(
  "/",
  employeeVerifyJwtToken,
  employeeIsPermitted(ADMIN_AND_EMPLOYEE),
  deleteProduct
);

export default Route;
