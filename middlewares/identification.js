/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  let token;
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    res.status(401).json({
      status: false,
      message: "Authorization failed and token is not available",
    });
  }
  const userToken = token.split(" ")[1];
  const isVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
  if (isVerified) {
    req.user = isVerified;
    console.log("verification complete and moving to next...");
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Authorization failed, The jwt token could'nt verified",
    });
  }
};
