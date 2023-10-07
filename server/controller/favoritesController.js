import {
  dbGetFavorites,
  dbAddFavorite,
  dbDeleteFavorite,
} from "../model/favoritesTable.js";

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await dbGetFavorites(userId);
    res.status(200).json({ res: data, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;
    await dbAddFavorite(userId, productId);
    res.status(200).json({ res: "Product saved", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;
    await dbDeleteFavorite(productId, userId);
    res.status(200).json({ res: "Removed", status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getFavorites, deleteFavorite, addFavorite };
