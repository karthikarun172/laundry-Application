/** @format */

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "jwtPrivateKey");
  return token;
};

const User = mongoose.model("User", userSchema);

function ValidateUser(user) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return Schema.validate(user);
}

exports.User = User;
exports.ValidateUser = ValidateUser;
