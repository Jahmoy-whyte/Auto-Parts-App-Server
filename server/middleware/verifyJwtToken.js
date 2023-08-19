import Jwt from "jsonwebtoken";
import CustomError from "../helper/CustomError.js";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJwtToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) throw new CustomError(401, "unauthorized");

    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!token) throw new CustomError(401, "is invalid token");

    const user = Jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
export default verifyJwtToken;
