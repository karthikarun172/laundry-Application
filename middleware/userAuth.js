/** @format */

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-userAuth-token");
  if (!token)
    return res.status(401).send(" User Access denided no token provided");

  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid User token");
  }
};
