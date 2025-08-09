const Users = require("../models/users.model");
const { verifyToken } = require("../utils/generateToken");

const isAdmin = (req, res, next) => {
  const token = res.cookie("Authorization");
  const payload = verifyToken(token);

  if (payload && payload.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied." });
};

module.exports = {
  isAdmin,
};
