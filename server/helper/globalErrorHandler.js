const globalErrorHandler = (error, req, res, next) => {
  if (error.statusCode) {
    //console.log("============================ this error");
    //console.log(error);
    res
      .status(error.statusCode)
      .json({ message: error.message, status: "nok" });
  } else {
    res.status(500).json({ message: error.message, status: "nok" });
  }
};

export default globalErrorHandler;
