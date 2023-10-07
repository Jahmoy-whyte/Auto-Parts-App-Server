import { Router } from "express";

import userVerifyJwtToken from "../middleware/user-middle-ware/userVerifyJwtToken.js";
import userIsPermitted from "../middleware/user-middle-ware/userIsPermitted.js";
import { USERS_AND_GUESTS } from "../helper/permission.js";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../controller/favoritesController.js";

const Route = Router();

Route.get(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  getFavorites
);

Route.post(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  addFavorite
);

Route.delete(
  "/",
  userVerifyJwtToken,
  userIsPermitted(USERS_AND_GUESTS),
  deleteFavorite
);

export default Route;
