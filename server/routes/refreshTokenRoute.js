import { Router } from "express";
import "dotenv/config";
import { dbCompareRefreshToken } from "../model/refreshTokenTable.js";
import CustomError from "../helper/CustomError.js";
import Jwt from "jsonwebtoken";
import { ACCESS_EXPIRES } from "../helper/accessTokenExpiresIn.js";
import crypto from "crypto";
const Route = Router();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

Route.post("/", async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log(refreshToken);
    // check to see if refresh token is in database
    const result = await dbCompareRefreshToken(refreshToken);
    if (!result) throw new CustomError(403, "forbidden(R101)");

    // verify refreshToken
    Jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) throw new CustomError(401, "forbidden(R201)");

      delete user.iat;
      // if no error create new new access token
      const newAccessToken = Jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_EXPIRES,
      });

      res.status(200).json({ res: newAccessToken, status: "ok" });
      console.log("refresh token");
    });
  } catch (error) {
    next(error);
  }
});

export default Route;
