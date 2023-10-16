import Jwt from "jsonwebtoken";
import CustomError from "../helper/CustomError.js";
import "dotenv/config";
import { ADMIN_AND_EMPLOYEE, USERS_AND_GUESTS } from "../helper/permission.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const EMPLOYEE_ACCESS_TOKEN_SECRET = process.env.EMPLOYEE_ACCESS_TOKEN_SECRET;

const socketVerifyJwtToken = async (socket, next) => {
  try {
    const authToken = socket.handshake.auth?.token;
    const authRole = socket.handshake.auth?.role;

    if (!authRole) throw new CustomError(401, "no role");
    if (!authToken) throw new CustomError(401, "no token");

    const SECRET = USERS_AND_GUESTS.includes(authRole)
      ? ACCESS_TOKEN_SECRET
      : EMPLOYEE_ACCESS_TOKEN_SECRET;

    Jwt.verify(authToken, SECRET, (err, user) => {
      if (err && err.message == "jwt expired")
        throw new CustomError(401, "jwt expired");
      if (err) throw new CustomError(401, "unauthorized");
      socket.user = user;
      return next();
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export default socketVerifyJwtToken;
