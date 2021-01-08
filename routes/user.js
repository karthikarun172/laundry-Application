/** @format */

const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, ValidateUser } = require("../models/user");
const adminAuth = require("../middleware/adminAuth");

router.get("/", adminAuth, async (req, res) => {
  let user = await User.find().select("-password");
  res.send(user);
});

router.get("/:id", async (req, res) => {
  let user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(400).send("Invalid user ID");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("user Already Exist");

  user = new User(_.pick(req.body, ["name", "phone", "email", "password"]));

  const salt = await bcrypt.genSalt(20);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();

  res.header("x-userAuth-token", token).send({ token });
});

router.delete("/:id", async (req, res) => {
  let user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(400).send("Invalid User Id");
  res.send(user);
});

module.exports = router;
