require("dotenv").config();
const { doHash, doHashValidation } = require("../utils/hashing");
const { signUpSchema } = require("../middleware/validator");
const jwt = require("jsonwebtoken");
const Users = require("../models/users.model");
const { signToken } = require("../utils/generateToken");

async function signUp(req, res) {
  const { email, password } = req.body;

  try {
    const { error, value } = signUpSchema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message, token });
    }

    const isExistingUser = await Users.findOne({ email });

    if (isExistingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await doHash(password);

    const newUser = new Users({
      email,
      password: hashedPassword,
    });
    const adminEmails = process.env.adminEmail.split(",");

    if (adminEmails.includes(newUser.email)) {
      newUser.role = "admin";
    }

    const result = await newUser.save();

    result.password = undefined;

    const token = signToken(newUser);

    res.cookie("Authorization", "Bearer " + token);

    res.status(201).json({
      success: true,
      message: "User created Sucessful !!",
      result,
    });
  } catch (error) {
    console.log(error);
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const { error, value } = signUpSchema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await Users.findOne({ email }).select("+password");

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User dont exists" });
    }

    const result = await doHashValidation(password, existingUser.password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials !!" });
    }

    const token = signToken(existingUser);

    res.cookie("Authorization", "Bearer " + token);

    res.json({
      success: true,
      token,
      message: "logged in successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

async function signOut(req, res) {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "Loged out successfully !!",
  });
}

module.exports = {
  signUp,
  signIn,
  signOut,
};
