/** @format */

const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Driver, ValidateDriver } = require("../models/driver");
const adminAuth = require("../middleware/adminAuth");

router.get("/", adminAuth, async (req, res) => {
  let driver = await Driver.find().select("-password");
  res.send(driver);
});

router.get("/:id", async (req, res) => {
  let driver = await Driver.findById(req.params.id).select("-password");
  if (!driver) return res.status(400).send("Invalid driver ID");
  res.send(driver);
});

router.post("/", async (req, res) => {
  const { error } = ValidateDriver(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let driver = await Driver.findOne({ phone: req.body.phone });
  if (driver) return res.status(400).send("Driver Already Exist");

  driver = new Driver(
    _.pick(req.body, ["image", "name", "phone", "email", "password"])
  );

  const salt = await bcrypt.genSalt(20);
  driver.password = await bcrypt.hash(driver.password, salt);

  const token = driver.generateAuthToken();

  await driver.save();

  res.header("x-driverAuth-token", token).send({ token });
});

module.exports = router;
