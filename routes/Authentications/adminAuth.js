/** @format */

const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Admin } = require("../../models/admin");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = ValidateAdminAuth(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let adminLogin = await Admin.findOne({ phone: req.body.phone });
  if (!adminLogin) return res.status(400).send("Not Registered");

  const ValidAdmin = await bcrypt.compare(
    req.body.password,
    adminLogin.password
  );
  if (!ValidAdmin) return res.status(400).send("Invalid Credentials");

  const token = adminLogin.generateAuthToken();

  res.send({ token });
});

function ValidateAdminAuth(auth) {
  const Schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return Schema.validate(auth);
}

module.exports = router;
