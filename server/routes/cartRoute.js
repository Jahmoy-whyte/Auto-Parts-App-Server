import { Router } from "express";
import {
  dbGetUserCart,
  dbAddToCart,
  dbDeleteCartItem,
  dbUpdateCartItem,
} from "../model/cartTable.js";
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
    const insertId = await dbAddToCart(id, productId, quantity);
    res.status(200).json({ res: insertId, status: "ok" });
    console.log("add to cart");
  } catch (error) {
    next(error);
  }
});

Route.delete("/", async (req, res, next) => {
  try {
    const { cartId } = req.body;
    await dbDeleteCartItem(cartId);
    res.status(200).json({ res: "deleted", status: "ok" });
    console.log("item deleted");
  } catch (error) {
    next(error);
  }
});

Route.patch("/", async (req, res, next) => {
  try {
    const { quantity, cartId } = req.body;
    await dbUpdateCartItem(quantity, cartId);
    res.status(200).json({ res: "cart updated", status: "ok" });
    console.log("item updated");
  } catch (error) {
    next(error);
  }
});

export default Route;
