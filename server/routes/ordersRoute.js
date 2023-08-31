import { Router } from "express";
import {
  dbDeleteCart,
  dbGetUserOrders,
  dbInsertOrder,
  dbInsertOrderItems,
} from "../model/ordersTable.js";

const Route = Router();

Route.post("/", async (req, res, next) => {
  try {
    const { address, productsArray, total } = req.body;
    const userId = req.user.id;
    const orderId = await dbInsertOrder(userId, address, total);
    await dbInsertOrderItems(2, productsArray);
    await dbDeleteCart(userId);
    res.status(200).json({ res: orderId, status: "ok" });
    console.log("orders");
  } catch (error) {
    next(error);
  }
});

Route.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await dbGetUserOrders(userId);
    res.status(200).json({ res: orders, status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
