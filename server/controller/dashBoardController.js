import { dbGetDashBoardData } from "../model/dashBoardTable.js";

const getDashBoardData = async (req, res, next) => {
  try {
    const obj = await dbGetDashBoardData();
    res.json({ res: obj, status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getDashBoardData };
