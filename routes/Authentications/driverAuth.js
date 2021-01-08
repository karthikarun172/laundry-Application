/** @format */

const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Driver } = require("../../models/driver");

router.post("/", async (req, res) => {
  const { error } = ValidateDriverAuth(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let driverLogin = await Driver.findOne({ phone: req.body.phone });
  if (!driverLogin) return res.status(400).send("Need to Register");

  let validDriver = await bcrypt.compare(
    req.body.password,
    driverLogin.password
  );
  if (!validDriver) return res.status(400).send("Invalid Credentials");

  const token = driverLogin.generateAuthToken();

  res.send({ token });
});

function ValidateDriverAuth(auth) {
  const Schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return Schema.validate(auth);
}

module.exports = router;
