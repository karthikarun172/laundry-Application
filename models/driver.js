/** @format */

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const driverSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

driverSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "jwtPrivateKey");
  return token;
};

const Driver = mongoose.model("Driver", driverSchema);

function ValidateDriver(driver) {
  const Schema = Joi.object({
    image: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return Schema.validate(driver);
}

exports.ValidateDriver = ValidateDriver;
exports.Driver = Driver;
