import Jwt from "jsonwebtoken";
import CustomError from "../helper/CustomError.js";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const socketVerifyJwtToken = async (socket, next) => {
  try {
    const authHeader = socket.handshake.auth?.token;
    console.log(authHeader);
    if (!authHeader) throw new CustomError(401, "unauthorized(V101)");

    const token = authHeader;

    if (!token) throw new CustomError(401, "unauthorized(V201)");

    Jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err && err.message == "jwt expired")
        throw new CustomError(401, "jwt expired");
      if (err) throw new CustomError(401, "unauthorized(V301)");
      socket.user = user;
      return next();
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export default socketVerifyJwtToken;
