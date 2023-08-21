import CustomError from "../helper/CustomError.js";
const isPermitted = (req, res, next) => {
  console.log("THIS RAN ===========");
  const userStatus = req.user.userStatus;
  const permit = ["user", "guest"];

  const bool = permit.includes(userStatus);
  if (bool) {
    next();
  } else {
    throw new CustomError(401, "Not unauthorized (P101)");
  }
};
export default isPermitted;
