import {
  dbAddSubCategory,
  dbDeleteSubCategory,
  dbGetSubCategory,
  dbUpdateSubCategory,
} from "../model/categoriesTable.js";

const getSubCategory = async (req, res, next) => {
  try {
    const data = await dbGetSubCategory();
    res.status(200).json({ res: data, status: "ok" });
    console.log("Get subcategory");
  } catch (error) {
    next(error);
  }
};

const addSubCategory = async (req, res, next) => {
  try {
    const category = req.body.category;
    const insertId = await dbAddSubCategory(category);
    res.status(200).json({ res: "insert successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    const { categoryId, category } = req.body;
    await dbUpdateSubCategory(categoryId, category);
    res.status(200).json({ res: "update successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;
    await dbDeleteSubCategory(categoryId);
    res.status(200).json({ res: "delete successful", status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getSubCategory, addSubCategory, updateSubCategory, deleteSubCategory };
