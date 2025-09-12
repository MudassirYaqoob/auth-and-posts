const color = require("colors");
const colors = {
  GET: color.green,
  POST: color.yellow,
  PUT: color.blue,
  DELETE: color.red,
};
//to make the middle wares we need to assign a functions
//  value to a const parm and then export this
exports.notFound = (req, res, next) => {
  res.status(404).json({
    status: false,
    message: "The requested url is not found",
  });
  next();
};

exports.logger = (req, res, next) => {
  const loggerClr = colors[req.method] || color.white;
  console.log(
    loggerClr(
      `Request initiated: ${req.method}//${req.get("host")}${req.originalUrl}`
    )
  );
  next();
};

exports.errorHandler = (err, req, res, next) => {
  console.log(color.red("Error: " + err));
  if (err.status) {
    res.status(err.status).json({
      status: false,
      message: `Error: ${err.message}`,
    });
  } else {
    res.status(500).json({
      status: false,
      message: `Error: ${err.message}`,
    });
  }
  next();
};
