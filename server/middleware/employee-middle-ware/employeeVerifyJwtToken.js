import Jwt from "jsonwebtoken";
import CustomError from "../../helper/CustomError.js";
import "dotenv/config";

const EMPLOYEE_ACCESS_TOKEN_SECRET = process.env.EMPLOYEE_ACCESS_TOKEN_SECRET;

const employeeVerifyJwtToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    if (!authHeader) throw new CustomError(401, "unauthorized(V101)");
    console.log(authHeader);
    const token = authHeader.split(" ")[1];

    if (!token) throw new CustomError(401, "unauthorized(V201)");

    Jwt.verify(token, EMPLOYEE_ACCESS_TOKEN_SECRET, (err, user) => {
      if (err && err.message == "jwt expired")
        throw new CustomError(401, "jwt expired");
      if (err) throw new CustomError(401, "unauthorized(V301)");
      req.user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
};
export default employeeVerifyJwtToken;
