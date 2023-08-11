const bcrypt = require("bcrypt");

const saltRounds = 15;

module.exports = (password) => bcrypt.hashSync(password, saltRounds);
