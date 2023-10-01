import CustomError from "../../helper/CustomError.js";
const userIsPermitted = (permissions) => {
  return (req, res, next) => {
    console.log("THIS RAN ===========");
    console.log(permissions);
    console.log(req.user);
    const userStatus = req.user.userStatus;
    const permit = permissions;

    const bool = permit.includes(userStatus);
    if (bool) {
      next();
    } else {
      throw new CustomError(401, "Not unauthorized (P101)");
    }
  };
};
export default userIsPermitted;
