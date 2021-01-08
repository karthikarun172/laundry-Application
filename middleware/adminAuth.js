/** @format */

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-adminAuth-token");
  if (!token) return res.status(401).send("Admin Access token not provided");

  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    req.user = decoded;
    next();
  } catch (er) {
    res.status(400).send("Invalid Admin token");
  }
};
