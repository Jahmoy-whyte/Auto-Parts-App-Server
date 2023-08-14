import express, { Router } from "express";
import { dbGetMakeInfo, dbGetMake } from "../model/makerTable.js";

const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetMake();
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get make");
  } catch (error) {
    next(error.message);
  }
});

export default Route;
