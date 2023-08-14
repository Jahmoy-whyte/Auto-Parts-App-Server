import express, { Router } from "express";
import { dbGetNewArrival } from "../model/productsTable.js";

const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetNewArrival();
    res.status(200).json({ res: data, status: "ok" });
    console.log("product");
  } catch (error) {
    next(error.message);
  }
});

export default Route;
