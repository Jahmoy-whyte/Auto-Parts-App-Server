import express, { Router } from "express";
import { dbGetYearBasedOnModelId } from "../model/yearTable.js";

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

export default Route;
