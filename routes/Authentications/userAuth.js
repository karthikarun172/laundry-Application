/** @format */

const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../../models/user");

router.post("/", async (req, res) => {
  const { error } = ValidateUserAuth(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let userLogin = await User.findOne({ phone: req.body.phone });
  if (!userLogin) return res.status(400).send("Need to Register");

  let validDriver = await bcrypt.compare(req.body.password, userLogin.password);
  if (!validDriver) return res.status(400).send("Invalid Credentials");

  const token = userLogin.generateAuthToken();

  res.send({ token });
});

function ValidateUserAuth(auth) {
  const Schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return Schema.validate(auth);
}

module.exports = router;
