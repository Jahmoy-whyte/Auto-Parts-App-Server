import { Router } from "express";
import {
  dbCreateUser,
  dbUserExist,
  dbGetUser,
  dbLoggedInUserInfo,
  dbUpdateGuestToUser,
  dbLogoutUser,
  dbUpdateUser,
  dbUpdateSelectedAddress,
  dbGetAllUsers,
  dbCountUsers,
  dbUserSearch,
  dbDeleteUser,
  dbAddUser,
  dbGetUserById,
  dbUserUpdate,
} from "../model/usersTable.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import CustomError from "../helper/CustomError.js";
import { dbSaveRefreshToken } from "../model/refreshTokenTable.js";
import { ACCESS_EXPIRES } from "../helper/accessTokenExpiresIn.js";

import isPermitted from "../middleware/isPermitted.js";
import verifyJwtToken from "../middleware/verifyJwtToken.js";
import {
  USERS_AND_GUESTS,
  USER_ONLY,
  ADMIN_AND_EMPLOYEE,
} from "../helper/permission.js";
const Route = Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

Route.post("/signup", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (await dbUserExist(email))
      throw new CustomError(409, "User already exist");

    const hashedpassword = await hashPassword(password);
    const userId = randomUUID();
    await dbCreateUser(userId, email, hashedpassword, "user");

    res.status(200).json({ res: "Account created successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if user exist
    const userInfo = await dbGetUser(email);
    if (!userInfo.length) throw new CustomError(404, "User doesnt exist");

    // compare password with hashed password
    const user = userInfo[0];
    const bool = await comparePassword(password, user.password);
    if (!bool) throw new CustomError(401, "Password is incorrect");

    // delete password from object
    delete user.password;
    // sign access token
    const accessToken = Jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });

    // sign refresh token
    const refreshToken = Jwt.sign(user, REFRESH_TOKEN_SECRET);
    // save refresh token to table
    const refreshTokenTokenId = await dbSaveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      res: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        refreshTokenTokenId: refreshTokenTokenId,
      },
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
});

Route.post("/login/guest", async (req, res, next) => {
  try {
    const password = randomUUID();
    const userId = randomUUID();
    const hashedpassword = await hashPassword(password);
    // create users as guest
    await dbCreateUser(userId, "guest@email.com", hashedpassword, "guest");
    const user = { id: userId, userStatus: "guest" };
    const accessToken = Jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });
    const refreshToken = Jwt.sign(user, REFRESH_TOKEN_SECRET);
    // Save Refresh Token
    const refreshTokenTokenId = await dbSaveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      res: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        refreshTokenTokenId: refreshTokenTokenId,
      },
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
});

Route.post(
  "/guest-to-user-signup",
  verifyJwtToken,
  isPermitted(USERS_AND_GUESTS),
  async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const refreshTokenTokenId = req.body.refreshTokenTokenId;

      const { id } = req.user;

      if (await dbUserExist(email))
        throw new CustomError(409, "User already exist");
      const hashedpassword = await hashPassword(password);
      const userId = id;
      await dbLogoutUser(userId, refreshTokenTokenId);
      await dbUpdateGuestToUser(userId, email, hashedpassword, "user");

      res
        .status(200)
        .json({ res: "Account created successfully", status: "ok" });
    } catch (error) {
      next(error);
    }
  }
);

Route.post(
  "/logout",
  verifyJwtToken,
  isPermitted(USERS_AND_GUESTS),
  async (req, res, next) => {
    try {
      const { id } = req.user;

      const { refreshTokenTokenId } = req.body;
      const userId = id;
      await dbLogoutUser(userId, refreshTokenTokenId);
      res.status(200).json({ res: "logout successful", status: "ok" });
    } catch (error) {
      next(error);
    }
  }
);

/* 
=============================================================================================
=============================== not login or signup related =================================
=============================================================================================
*/
Route.get(
  "/",
  verifyJwtToken,
  isPermitted(USERS_AND_GUESTS),
  async (req, res, next) => {
    try {
      const { id } = req.user;
      console.log(id);
      const userInfo = await dbLoggedInUserInfo(id);
      if (userInfo.length < 1) throw new CustomError(404, "user not found");
      res.status(200).json({
        res: userInfo,
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.patch(
  "/",
  verifyJwtToken,
  isPermitted(USER_ONLY),
  async (req, res, next) => {
    try {
      const { id } = req.user;
      const { firstName, lastName, phone } = req.body;
      const affectedRows = await dbUpdateUser(firstName, lastName, phone, id);
      if (!affectedRows) throw new CustomError(404, "user not found");
      res.status(200).json({
        res: "Update sccessful",
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.patch(
  "/selected-address",
  verifyJwtToken,
  isPermitted(USERS_AND_GUESTS),
  async (req, res, next) => {
    try {
      const { id } = req.user;
      const { addressId } = req.body;
      const affectedRows = await dbUpdateSelectedAddress(addressId, id);
      if (!affectedRows) throw new CustomError(404, "user not found");
      res.status(200).json({
        res: "Update sccessful",
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.get(
  "/count-all-users",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),

  async (req, res, next) => {
    try {
      const count = await dbCountUsers();
      res.status(200).json({
        res: count,
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.get(
  "/all-users/:start/:end",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),

  async (req, res, next) => {
    const { start, end } = req.params;
    try {
      const users = await dbGetAllUsers(start, end);
      res.status(200).json({
        res: users,
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.get(
  "/user-search/:filter/:searchText",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),

  async (req, res, next) => {
    const { filter, searchText } = req.params;
    try {
      const users = await dbUserSearch(filter, searchText);
      res.status(200).json({
        res: users,
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.post(
  "/user-add",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),
  async (req, res, next) => {
    const userData = req.body.userData;

    const hashedPassword = await hashPassword(userData.password);
    const userId = randomUUID();
    userData.userId = userId;
    userData.password = hashedPassword;

    try {
      if (await dbUserExist(userData.email))
        throw new CustomError(409, "User already exist");

      await dbAddUser(userData);
      res.status(200).json({
        res: "User was added",
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.patch(
  "/user-update",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),
  async (req, res, next) => {
    const userData = req.body.userData;

    try {
      await dbUserUpdate(userData);
      res.status(200).json({
        res: "users update was successful",
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.get(
  "/user-by-id/:id",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),
  async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await dbGetUserById(id);
      if (user.length < 1) throw new CustomError(404, "User not found");
      res.status(200).json({
        res: user[0],
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

Route.delete(
  "/",
  verifyJwtToken,
  isPermitted(ADMIN_AND_EMPLOYEE),
  async (req, res, next) => {
    const userId = req.body.userId;
    try {
      await dbDeleteUser(userId);
      res.status(200).json({
        res: "delete successful",
        status: "ok",
      });
    } catch (error) {
      next(error);
    }
  }
);

const comparePassword = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};

const hashPassword = async (password) => {
  const hashedpassword = await bcrypt.hash(password, 10);
  return hashedpassword;
};

export default Route;
