import Jwt from "jsonwebtoken";
import CustomError from "../../helper/CustomError.js";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const userVerifyJwtToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) throw new CustomError(401, "unauthorized(V101)");

    const token = authHeader.split(" ")[1];

    if (!token) throw new CustomError(401, "unauthorized(V201)");

    Jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
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
export default userVerifyJwtToken;
