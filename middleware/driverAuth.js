/** @format */

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-driverAuth-token");
  if (!token)
    return res.status(401).send("Driver Access Denied no token provided");

  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    req.user = decoded;
    next();
  } catch (er) {
    res.status(400).send("Invalid Driver Token");
  }
};
