const bcrypt = require("bcrypt");

module.exports = (plain, hashed) => {
	return bcrypt.compareSync(plain, hashed);
};
