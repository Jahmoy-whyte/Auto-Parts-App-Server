import { Router } from "express";
import {
  dbGetNewArrival,
  dbSearchForProductWithCategory,
  dbSearchForProducts,
  dbGetProductById,
} from "../model/productsTable.js";

const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetNewArrival();
    res.status(200).json({ res: data, status: "ok" });
    console.log("product");
  } catch (error) {
    next(error);
  }
});

Route.get("/:makeId/:modelId/:yearId", async (req, res, next) => {
  try {
    const { makeId, modelId, yearId } = req.params;
    const data = await dbSearchForProducts(makeId, modelId, yearId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product make year model");
  } catch (error) {
    next(error);
  }
});

Route.get(
  "/:makeId/:modelId/:yearId/:subCategoryId",
  async (req, res, next) => {
    try {
      const { makeId, modelId, yearId, subCategoryId } = req.params;
      const data = await dbSearchForProductWithCategory(
        makeId,
        modelId,
        yearId,
        subCategoryId
      );
      res.status(200).json({ res: data, status: "ok" });
      console.log("product make, model, year, subCategory");
    } catch (error) {
      next(error);
    }
  }
);

Route.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const data = await dbGetProductById(productId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product by id");
  } catch (error) {
    next(error);
  }
});

export default Route;
