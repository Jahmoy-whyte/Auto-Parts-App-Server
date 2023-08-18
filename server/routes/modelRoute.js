import express, { Router } from "express";
import { dbGetModelBasedOnMakeId } from "../model/modelTable.js";

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

export default Route;
