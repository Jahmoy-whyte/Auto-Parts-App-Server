import { Router } from "express";
import "dotenv/config";
import { getNewAccessToken } from "../controller/refreshTokenController.js";

const Route = Router();

Route.post("/", getNewAccessToken);

export default Route;
