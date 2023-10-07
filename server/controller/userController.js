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
  dbCountAllAccounts,
  dbUserSearch,
  dbDeleteUser,
  dbAddUser,
  dbGetUserById,
  dbUserUpdate,
  dbDeleteRefreshtoken,
} from "../model/usersTable.js";

import { randomUUID } from "crypto";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import CustomError from "../helper/CustomError.js";
import { dbSaveRefreshToken } from "../model/refreshTokenTable.js";
import { ACCESS_EXPIRES } from "../helper/accessTokenExpiresIn.js";

import { hashPassword, comparePassword } from "../helper/bcryptHelper.js";

const USER = "user";
const GUEST_EMAIL = "guest@email.com";
const GUEST = "guest";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (await dbUserExist(email))
      throw new CustomError(409, "User already exist");

    const hashedpassword = await hashPassword(password);
    const userId = randomUUID();
    await dbCreateUser(userId, email, hashedpassword, USER);

    res.status(200).json({ res: "Account created successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
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
    await dbSaveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      res: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const createGuestAccount = async (req, res, next) => {
  try {
    const password = randomUUID();
    const userId = randomUUID();
    const hashedpassword = await hashPassword(password);
    // create users as guest
    await dbCreateUser(userId, GUEST_EMAIL, hashedpassword, GUEST);
    const user = { id: userId, userStatus: GUEST };
    const accessToken = Jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });
    const refreshToken = Jwt.sign(user, REFRESH_TOKEN_SECRET);
    // Save Refresh Token
    await dbSaveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      res: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const convertGuestToUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const refreshToken = req.body.refreshToken;

    const { id } = req.user;

    if (await dbUserExist(email))
      throw new CustomError(409, "User already exist");
    const hashedpassword = await hashPassword(password);
    const userId = id;
    await dbLogoutUser(userId, refreshToken);
    await dbUpdateGuestToUser(userId, email, hashedpassword, USER);

    res.status(200).json({ res: "Account created successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { refreshToken } = req.body;
    const userId = id;
    await dbLogoutUser(userId, refreshToken);
    res.status(200).json({ res: "logout successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

/* 
=============================================================================================
=============================== not login or signup related =================================
=============================================================================================
*/
const getAccountInfo = async (req, res, next) => {
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
};

const updateAccount = async (req, res, next) => {
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
};

const updateSelectedAddress = async (req, res, next) => {
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
};

const countAllAccounts = async (req, res, next) => {
  try {
    const count = await dbCountAllAccounts();
    res.status(200).json({
      res: count,
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
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
};

const getUsersBySearch = async (req, res, next) => {
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
};

const createUserAccount = async (req, res, next) => {
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
};

const updateUserAccount = async (req, res, next) => {
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
};

const getUserById = async (req, res, next) => {
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
};

const deleteUser = async (req, res, next) => {
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
};

const InvalidateRefreshtoken = async (req, res, next) => {
  const id = req.params.id;
  try {
    await dbDeleteRefreshtoken(id);
    res.status(200).json({
      res: "Sign out successful",
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

export {
  InvalidateRefreshtoken,
  signup,
  login,
  createGuestAccount,
  convertGuestToUser,
  logout,
  getAccountInfo,
  updateAccount,
  updateSelectedAddress,
  countAllAccounts,
  getUsers,
  getUsersBySearch,
  createUserAccount,
  updateUserAccount,
  getUserById,
  deleteUser,
};
