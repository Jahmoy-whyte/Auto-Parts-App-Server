import { Router } from "express";
import {
  dbDeleteCart,
  dbDeleteOrders,
  dbGetAllOrders,
  dbGetOrdersOnCondition,
  dbGetUserOrderDetail,
  dbGetUserOrders,
  dbInsertOrder,
  dbInsertOrderItems,
  dbOrdersCount,
  dbOrdersSearch,
  dbUpdateOrderStatus,
} from "../model/ordersTable.js";
import verifyJwtToken from "../middleware/verifyJwtToken.js";
const Route = Router();

Route.post("/", verifyJwtToken, async (req, res, next) => {
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

Route.get("/", verifyJwtToken, async (req, res, next) => {
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
    console.log(id);
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

Route.get("/orders/count-orders", async (req, res, next) => {
  try {
    const orders = await dbOrdersCount();
    res.status(200).json({ res: orders[0], status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.get("/orders/get/:status/:start/:limit", async (req, res, next) => {
  try {
    const { status, start, limit } = req.params;
    const orders = await dbGetOrdersOnCondition(status, start, limit);
    res.status(200).json({ res: orders, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.get(
  "/orders/search/:status/:filter/:searchText",
  async (req, res, next) => {
    try {
      const { status, filter, searchText } = req.params;
      const orders = await dbOrdersSearch(status, filter, searchText);
      res.status(200).json({ res: orders, status: "ok" });
    } catch (error) {
      next(error);
    }
  }
);

Route.patch("/update/status", async (req, res, next) => {
  try {
    const { orderId, status } = req.body;
    await dbUpdateOrderStatus(orderId, status);
    res.status(200).json({ res: "order update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.delete("/", async (req, res, next) => {
  try {
    const { orderId } = req.body;
    await dbDeleteOrders(orderId);
    res.status(200).json({ res: "Delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;

/*


Route.get("/orders/sales", async (req, res, next) => {
  try {
    const sales = await dbGetSales();
    res.status(200).json({ res: sales, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.get("/orders/average-daily-sales", async (req, res, next) => {
  try {
    const average = await dbAverageDailySales();
    res.status(200).json({ res: average[0], status: "ok" });
  } catch (error) {
    next(error);
  }
});
*/
