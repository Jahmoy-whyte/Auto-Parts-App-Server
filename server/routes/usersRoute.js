import { Router } from "express";
import { dbCreateUser, dbUserExist, dbGetUser } from "../model/usersTable.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import CustomError from "../helper/CustomError.js";
import verifyJwtToken from "../helper/verifyJwtToken.js";
const Route = Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;

Route.post("/signup", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (await dbUserExist(email))
      throw new CustomError(409, "User already exist");

    const hashedpassword = await hashPassword(password);
    const userId = randomUUID();
    await dbCreateUser(userId, email, hashedpassword);

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
    // compare password
    const user = userInfo[0];
    const bool = await comparePassword(password, user.password);
    if (!bool) throw new CustomError(401, "Password is incorrect");

    delete user.password;

    const accessToken = Jwt.sign(user, ACCESS_TOKEN_SECRET);

    res.status(200).json({ res: accessToken, status: "ok" });
  } catch (error) {
    next(error);
  }
});

const comparePassword = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};

const hashPassword = async (password) => {
  const hashedpassword = await bcrypt.hash(password, 10);
  return hashedpassword;
};

export default Route;
