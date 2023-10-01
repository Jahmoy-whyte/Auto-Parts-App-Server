import {
  dbGetMakeInfo,
  dbGetMake,
  dbGetMakes,
  dbAddMake,
  dbUpdateMake,
  dbDeleteMake,
} from "../model/makeTable.js";
import { ADMIN_ONLY } from "../helper/permission.js";
import isPermitted from "../middleware/user-middle-ware/userIsPermitted.js";

const getMake = async (req, res, next) => {
  try {
    const data = await dbGetMake();
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get make");
  } catch (error) {
    next(error);
  }
};

//Route.use(isPermitted(ADMIN_ONLY));

const getMakes = async (req, res, next) => {
  try {
    const data = await dbGetMakes();
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const addMake = async (req, res, next) => {
  try {
    const make = req.body.make;
    const insertId = await dbAddMake(make);
    res.status(200).json({ res: "insert successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const updateMake = async (req, res, next) => {
  try {
    const { makeId, make } = req.body;
    await dbUpdateMake(makeId, make);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteMake = async (req, res, next) => {
  try {
    const makeId = req.body.makeId;
    await dbDeleteMake(makeId);
    res.status(200).json({ res: "delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getMake, getMakes, addMake, updateMake, deleteMake };
