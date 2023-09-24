import { Router } from "express";
import {
  dbGetMakeInfo,
  dbGetMake,
  dbAddMake,
  dbUpdateMake,
  dbDeleteMake,
} from "../model/makeTable.js";
import { ADMIN_ONLY } from "../helper/permission.js";
import isPermitted from "../middleware/isPermitted.js";
const Route = Router();

Route.get("/", async (req, res, next) => {
  try {
    const data = await dbGetMake();
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get make");
  } catch (error) {
    next(error);
  }
});

Route.use(isPermitted(ADMIN_ONLY));

Route.post("/", async (req, res, next) => {
  try {
    const make = req.body.make;
    const insertId = await dbAddMake(make);
    res.status(200).json({ res: insertId, status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.patch("/", async (req, res, next) => {
  try {
    const makeId = req.body.makeId;
    await dbUpdateMake(makeId);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
});

Route.delete("/", async (req, res, next) => {
  try {
    const makeId = req.body.makeId;
    await dbDeleteMake(makeId);
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
});

export default Route;
