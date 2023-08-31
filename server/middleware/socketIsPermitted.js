import CustomError from "../helper/CustomError.js";
const socketIsPermitted = (permissions) => {
  return (socket, next) => {
    console.log("THIS RAN ===========");
    const userStatus = socket.user.userStatus;
    const permit = permissions;

    const bool = permit.includes(userStatus);
    if (bool) {
      next();
    } else {
      next(new CustomError(401, "Not unauthorized (P101)"));
    }
  };
};
export default socketIsPermitted;
