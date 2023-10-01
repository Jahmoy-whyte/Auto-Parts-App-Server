import {
  dbAddAddress,
  dbDeleteAddress,
  dbGetAddress,
  dbSearchForLocation,
} from "../model/addressTable.js";

const getAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const addresses = await dbGetAddress(id);
    res.status(200).json({ res: addresses, status: "ok" });
    console.log("get address");
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { address, additionalInfo, placeType } = req.body;
    await dbAddAddress(id, address, additionalInfo, placeType);
    res.status(200).json({ res: "address was added", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.body;
    await dbDeleteAddress(addressId);
    res.status(200).json({ res: "deleted", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const searchForLocation = async (req, res, next) => {
  try {
    const { name } = req.params;
    const list = await dbSearchForLocation(name);
    console.log(name);
    res.status(200).json({ res: list, status: "ok" });
  } catch (error) {
    next(error);
  }
};

export { getAddress, addAddress, deleteAddress, searchForLocation };
