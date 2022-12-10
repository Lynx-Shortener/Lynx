const Account = require("../../models/account");
const hashPassword = require("../password/hash");
const { v4: uuid4 } = require("uuid");

module.exports = async ({ username, email, password }) => {
	const account = new Account({
		id: uuid4(),
		username,
		password: hashPassword(password),
		email,
	});

	await account.save();

	return [account, null];
};
