/** @format */

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const adminUser = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminUser.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "jwtPrivateKey");
  return token;
};

const Admin = mongoose.model("Admin", adminUser);

function ValidateAdmin(admin) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return Schema.validate(admin);
}

exports.ValidateAdmin = ValidateAdmin;
exports.Admin = Admin;
