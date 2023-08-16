import { Router } from "express";
import { dbGetSubCategory } from "../model/categoriesTable.js";

const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetSubCategory();
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get subcategory");
  } catch (error) {
    next(error.message);
  }
});

export default Route;
