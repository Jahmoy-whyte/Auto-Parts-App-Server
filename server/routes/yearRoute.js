import express, { Router } from "express";
import {
  dbAddYear,
  dbDeleteYear,
  dbGetYearBasedOnModelId,
  dbGetYears,
  dbUpdateYear,
} from "../model/yearTable.js";
import { ADMIN_ONLY } from "../helper/permission.js";
import isPermitted from "../middleware/isPermitted.js";
const Route = Router();

Route.get("/:modelId", async (req, res, next) => {
  try {
    const modelId = req.params.modelId;
    const data = await dbGetYearBasedOnModelId(modelId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get model based on model id");
  } catch (error) {
    next(error);
  }
});

Route.use(isPermitted(ADMIN_ONLY));

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetYears();
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.post("/", async (req, res, next) => {
  try {
    const { modelId, year } = req.body;
    const insertId = await dbAddYear(modelId, year);
    res.status(200).json({ res: insertId, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.patch("/", async (req, res, next) => {
  try {
    const { modelId, year, yearId } = req.body;
    await dbUpdateYear(modelId, year, yearId);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.delete("/", async (req, res, next) => {
  try {
    const yearId = req.body.yearId;
    await dbDeleteYear(yearId);
    res.status(200).json({ res: "delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
