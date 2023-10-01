import {
  dbAddModel,
  dbDeleteModel,
  dbGetModelBasedOnMakeId,
  dbGetModels,
  dbUpdateModel,
} from "../model/modelTable.js";

const getModelBasedOnMakeId = async (req, res, next) => {
  try {
    const makeId = req.params.makeId;
    const data = await dbGetModelBasedOnMakeId(makeId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get model bsed on make id");
  } catch (error) {
    next(error);
  }
};

const getModel = async (req, res, next) => {
  try {
    const data = await dbGetModels();
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const addModel = async (req, res, next) => {
  try {
    const { makeId, model } = req.body;
    const insertId = await dbAddModel(makeId, model);
    res.status(200).json({ res: model + "successfully added", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const updateModel = async (req, res, next) => {
  try {
    const { makeId, model, modelId } = req.body;
    await dbUpdateModel(makeId, model, modelId);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteModel = async (req, res, next) => {
  try {
    const modelId = req.body.modelId;
    await dbDeleteModel(modelId);
    res.status(200).json({ res: "delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getModelBasedOnMakeId, getModel, addModel, updateModel, deleteModel };
