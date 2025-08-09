const bcrypt = require("bcrypt");

async function doHash(password) {
  const salt = await bcrypt.genSalt(12);

  const hash = await bcrypt.hash(password, salt);

  return hash;
}

async function doHashValidation(value, hashValue) {
  const result = await bcrypt.compare(value, hashValue);

  return result;
}

module.exports = {
  doHash,
  doHashValidation,
};
