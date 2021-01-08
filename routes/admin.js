/** @format */

const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Admin, ValidateAdmin } = require("../models/admin");

router.get("/", async (req, res) => {
  let admin = await Admin.find();
  res.send(admin);
});

router.get("/:id", async (req, res) => {
  let admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(400).send("Invalid admin ID");
  res.send(admin);
});

router.post("/", async (req, res) => {
  const { error } = ValidateAdmin(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let admin = await Admin.findOne({ phone: req.body.phone });
  if (admin) return res.status(400).send("Admin already exist");

  admin = new Admin(
    _.pick(req.body, ["name", "email", "phone", "role", "password"])
  );

  const salt = await bcrypt.genSalt(20);
  admin.password = await bcrypt.hash(admin.password, salt);

  const token = admin.generateAuthToken();

  await admin.save();

  res.header("x-adminAuth-header", token).send({ token });
});

router.delete("/:id", async (req, res) => {
  let admin = await Admin.findByIdAndRemove(req.params.id);
  if (!admin) return res.status(400).send("Invalid Genre Id");
  res.send(admin);
});

module.exports = router;
