const bcrypt = require("bcrypt");
const saltRounds = 15;

module.exports = (password) => {
	return bcrypt.hashSync(password, saltRounds);
};
