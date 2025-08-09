const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

function signToken(payload) {
  try {
    const token = jwt.sign(
      {
        email: payload.email,
        role: payload.role,
      },
      process.env.jwtPrivateKey,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    console.log(error);
  }
}

function verifyToken(token) {
  const valid = jwt.verify(token, process.env.jwtPrivateKey);
  return valid;
}

module.exports = {
  signToken,
  verifyToken,
};
