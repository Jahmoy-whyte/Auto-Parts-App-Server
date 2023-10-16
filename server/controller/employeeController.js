import {
  dbEmployeeExist,
  dbCreateEmployeeAccount,
  dbLogoutEmployee,
  dbCountEmployees,
  dbGetAllEmployees,
  dbEmployeeSearch,
  dbEmployeeUpdate,
  dbGetEmployeeById,
  dbDeleteEmployee,
  dbDeleteRefreshtoken,
} from "../model/employeeTable.js";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import CustomError from "../helper/CustomError.js";
import {
  dbCompareRefreshToken,
  dbSaveRefreshToken,
} from "../model/refreshTokenTable.js";
import { ACCESS_EXPIRES } from "../helper/accessTokenExpiresIn.js";
import { comparePassword, hashPassword } from "../helper/bcryptHelper.js";

const EMPLOYEE_ACCESS_TOKEN_SECRET = process.env.EMPLOYEE_ACCESS_TOKEN_SECRET;
const EMPLOYEE_REFRESH_TOKEN_SECRET = process.env.EMPLOYEE_REFRESH_TOKEN_SECRET;

const signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const user = await dbEmployeeExist(email);
    if (user.length) throw new CustomError(409, "Employee already exist");

    const hashedpassword = await hashPassword(password);

    await dbCreateEmployeeAccount(
      firstName,
      lastName,
      email,
      hashedpassword,
      role
    );

    res.status(200).json({ res: "Account created successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if user exist
    const userInfo = await dbEmployeeExist(email);
    if (!userInfo.length) throw new CustomError(404, "User doesnt exist");

    // compare password with hashed password
    const user = userInfo[0];
    const bool = await comparePassword(password, user.password);
    if (!bool) throw new CustomError(401, "Password is incorrect");

    // delete password from object
    delete user.password;
    // sign access token
    const accessToken = Jwt.sign(user, EMPLOYEE_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });

    // sign refresh token
    const refreshToken = Jwt.sign(user, EMPLOYEE_REFRESH_TOKEN_SECRET);
    // save refresh token to table
    await dbSaveRefreshToken(user.id, refreshToken);

    // res.cookie("tokens", "tokens");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60, // = 3600 sec which  = 60 min
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ res: { accessToken: accessToken, user: user } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;

    const cookie = req.cookies;
    const refreshToken = cookie?.refreshToken;
    if (!refreshToken) throw new CustomError(401, "refreshToken not found");
    const userId = id;

    await dbLogoutEmployee(userId, refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({ res: "logout successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new CustomError(403, "forbidden(R101)");
    // check to see if refresh token is in database
    const result = await dbCompareRefreshToken(refreshToken);
    if (!result) throw new CustomError(403, "forbidden(R101)");

    // verify refreshToken
    Jwt.verify(refreshToken, EMPLOYEE_REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) throw new CustomError(401, "forbidden(R102)");

      delete user.iat;
      // if no error create new new access token
      const newAccessToken = Jwt.sign(user, EMPLOYEE_ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_EXPIRES,
      });

      res.status(200).json({
        res: { accessToken: newAccessToken, user: user },
        status: "ok",
      });
      console.log("employee refresh token");
    });
  } catch (error) {
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const id = req.user.id;
    const data = await dbGetEmployeeById(id);
    res.status(200).json({
      res: data[0],
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const countEmployees = async (req, res, next) => {
  try {
    const count = await dbCountEmployees();
    res.status(200).json({
      res: count,
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  const { start, end } = req.params;
  try {
    const employees = await dbGetAllEmployees(start, end);
    res.status(200).json({
      res: employees,
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const employeeSearch = async (req, res, next) => {
  const { filter, searchText } = req.params;
  try {
    const employees = await dbEmployeeSearch(filter, searchText);
    res.status(200).json({
      res: employees,
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const employeeUpdate = async (req, res, next) => {
  const employeeData = req.body.employeeData;
  console.log(employeeData);
  try {
    await dbEmployeeUpdate(employeeData);
    res.status(200).json({
      res: "Account update was successful",
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const employee = await dbGetEmployeeById(id);
    if (employee.length < 1)
      throw new CustomError(404, "Employee account not found");
    res.status(200).json({
      res: employee[0],
      status: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  const employeeId = req.body.employeeId;
  try {
    await dbDeleteEmployee(employeeId);
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
  signUp,
  login,
  logout,
  refreshToken,
  getAccount,
  countEmployees,
  getAllEmployees,
  employeeSearch,
  employeeUpdate,
  getEmployeeById,
  deleteEmployee,
};
