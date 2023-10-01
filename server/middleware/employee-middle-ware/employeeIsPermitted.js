import CustomError from "../../helper/CustomError.js";
const employeeIsPermitted = (permissions) => {
  return (req, res, next) => {
    console.log("THIS RAN ===========");
    console.log(permissions);
    const userRole = req.user.role;
    const permit = permissions;
    console.log(req.user);
    const bool = permit.includes(userRole);
    if (bool) {
      next();
    } else {
      throw new CustomError(401, "Not unauthorized (P101)");
    }
  };
};
export default employeeIsPermitted;
