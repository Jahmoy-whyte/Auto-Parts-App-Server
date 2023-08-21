import { Router } from "express";
import { dbGetUserCart, dbAddToCart } from "../model/cartTable.js";
const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = await dbGetUserCart(id);
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get user cart");
  } catch (error) {
    next(error);
  }
});

Route.post("/", async (req, res, next) => {
  try {
    const { id } = req.user; // get user id if they are verified

    const { productId, quantity } = req.body;
    await dbAddToCart(id, productId, quantity);
    res.status(200).json({ res: "added", status: "ok" });
    console.log("add to cart");
  } catch (error) {
    next(error);
  }
});

export default Route;
