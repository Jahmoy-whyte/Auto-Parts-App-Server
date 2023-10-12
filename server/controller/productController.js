import {
  dbGetNewArrival,
  dbSearchForProductWithCategory,
  dbSearchForProducts,
  dbGetProductById,
  dbProuductPagination,
  dbCountProducts,
  dbGetProducts,
  dbSearchForProductsByText,
  dbAddProducts,
  dbUpdateProduct,
  dbDeleteProduct,
  dbUserGetProductById,
  dbGetProductByCategory,
} from "../model/productsTable.js";

const getNewArrival = async (req, res, next) => {
  try {
    const data = await dbGetNewArrival();
    res.status(200).json({ res: data, status: "ok" });
    console.log("product");
  } catch (error) {
    next(error);
  }
};

const getProductByCategory = async (req, res, next) => {
  try {
    const subCategoryId = req.params.subCategoryId;
    const data = await dbGetProductByCategory(subCategoryId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product");
  } catch (error) {
    next(error);
  }
};

const getProductsByAttributes = async (req, res, next) => {
  try {
    const { makeId, modelId, yearId } = req.params;
    const data = await dbSearchForProducts(makeId, modelId, yearId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product make year model");
  } catch (error) {
    next(error);
  }
};

const getProductsByAttributesAndCategory = async (req, res, next) => {
  try {
    const { makeId, modelId, yearId, subCategoryId } = req.params;
    const data = await dbSearchForProductWithCategory(
      makeId,
      modelId,
      yearId,
      subCategoryId
    );
    res.status(200).json({ res: data, status: "ok" });
    console.log("product make, model, year, subCategory");
  } catch (error) {
    next(error);
  }
};

const userGetProductById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const data = await dbUserGetProductById(productId, userId);
    console.log(data);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product by id");
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const data = await dbGetProductById(productId);
    res.status(200).json({ res: data, status: "ok" });
    console.log("product by id");
  } catch (error) {
    next(error);
  }
};

const prouductPagination = async (req, res, next) => {
  try {
    const { lastId } = req.params;
    const data = await dbProuductPagination(lastId);
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const countProducts = async (req, res, next) => {
  try {
    const data = await dbCountProducts();
    res.status(200).json({ res: data[0], status: "ok" });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { start, limit } = req.query;
    const data = await dbGetProducts(start, limit);
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const searchForProductsByText = async (req, res, next) => {
  try {
    const { text, filter } = req.query;
    const data = await dbSearchForProductsByText(text, filter);
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const addProducts = async (req, res, next) => {
  try {
    const body = req.body;
    const data = await dbAddProducts(body);
    res.status(200).json({ res: "Added successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const data = await dbUpdateProduct(body);
    res.status(200).json({ res: "Update successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.body;
    const data = await dbDeleteProduct(id);
    res.status(200).json({ res: "product Deleted successfully", status: "ok" });
  } catch (error) {
    next(error);
  }
};

export {
  getNewArrival,
  getProductsByAttributes,
  getProductsByAttributesAndCategory,
  getProductById,
  prouductPagination,
  countProducts,
  getProducts,
  searchForProductsByText,
  addProducts,
  updateProduct,
  deleteProduct,
  userGetProductById,
  getProductByCategory,
};

/*

Full texts
product_id Ascending 1	
product_name	
make_id	
model_id	
year_id	
subcategory_id	
description	
price	
new_arrival	
condition_of_part	
image	
status





     productName,
      makeId,
      modelId,
      yearId,
      subCategoryId,
      description,
      price,
      newArrival,
      conditionOfPart,
      image,
      status,



*/
