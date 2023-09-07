import { Router } from "express";
import {
  dbDeleteCart,
  dbGetAllOrders,
  dbGetUserOrderDetail,
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
    await dbInsertOrderItems(orderId, productsArray);
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

Route.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const orderDetail = await dbGetUserOrderDetail(id);
    res.status(200).json({ res: orderDetail, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.get("/orders/get", async (req, res, next) => {
  try {
    const orders = await dbGetAllOrders();
    res.status(200).json({ res: orders, status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
