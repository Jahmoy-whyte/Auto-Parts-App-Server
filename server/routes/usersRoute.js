import { Router } from "express";
import { dbCreateUser, dbUserExist, dbGetUser } from "../model/usersTable.js";
import bcrypt from "bcrypt";
const Route = Router();

Route.post("/signup", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (await dbUserExist(email))
      return res
        .status(409)
        .json({ message: "user already exists", status: "nok" });
    const hashedpassword = await hashPassword(password);
    await dbCreateUser(email, hashedpassword);
    res.status(200).json({ res: "user created successfully", status: "ok" });
  } catch (error) {
    next(error.message);
  }
});

Route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedpassword = await comparePassword(password);
    res.status(200).json({ res: hashedpassword, status: "ok" });
  } catch (error) {
    next(error.message);
  }
});

const comparePassword = async (password) => {
  const hashedpassword = await bcrypt.compare(password, 10);
  return hashedpassword;
};

const hashPassword = async (password) => {
  const hashedpassword = await bcrypt.hash(password, 10);
  return hashedpassword;
};

export default Route;
