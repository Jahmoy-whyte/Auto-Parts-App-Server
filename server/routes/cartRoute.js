import { Router } from "express";
import { dbGetUserCart } from "../model/cartTable.js";
const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const { userId } = req.user;
    const data = await dbGetUserCart(userId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get user cart");
  } catch (error) {
    next(error);
  }
});

export default Route;
