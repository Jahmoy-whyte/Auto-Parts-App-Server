import express, { Router } from "express";
import {
  dbAddModel,
  dbDeleteModel,
  dbGetModelBasedOnMakeId,
  dbGetModels,
  dbUpdateModel,
} from "../model/modelTable.js";
import { ADMIN_ONLY } from "../helper/permission.js";
import isPermitted from "../middleware/isPermitted.js";
const Route = Router();

Route.get("/:makeId", async (req, res, next) => {
  try {
    const makeId = req.params.makeId;
    const data = await dbGetModelBasedOnMakeId(makeId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get model bsed on make id");
  } catch (error) {
    next(error);
  }
});

Route.use(isPermitted(ADMIN_ONLY));

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetModels();
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.post("/", async (req, res, next) => {
  try {
    const { makeId, model } = req.body;
    const insertId = await dbAddModel(makeId, model);
    res.status(200).json({ res: model + "successfully added", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.patch("/", async (req, res, next) => {
  try {
    const { makeId, model, modelId } = req.body;
    await dbUpdateModel(makeId, model, modelId);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.delete("/", async (req, res, next) => {
  try {
    const modelId = req.body.modelId;
    await dbDeleteModel(modelId);
    res.status(200).json({ res: "delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
