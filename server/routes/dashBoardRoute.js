import { Router } from "express";
import { dbGetDashBoardData } from "../model/dashBoardTable.js";

const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const obj = await dbGetDashBoardData();
    res.json({ res: obj, status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
