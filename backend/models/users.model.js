const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // admin
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
