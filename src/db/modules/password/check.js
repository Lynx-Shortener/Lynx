const bcrypt = require("bcrypt");

module.exports = (plain, hashed) => bcrypt.compareSync(plain, hashed);
