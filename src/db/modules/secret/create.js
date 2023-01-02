const Account = require("../../models/account");

const newSecret = () => {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	return [...new Array(32)].map((_) => chars[Math.floor(Math.random() * chars.length)]).join("");
};

module.exports = async (account) => {
	let uniqueSecret = false;
	let secret;
	while (!uniqueSecret) {
		secret = newSecret();
		const existingSecret = await Account.findOne({ secret });
		if (!existingSecret) uniqueSecret = true;
	}

	account.secret = secret;
	account.save();

	return secret;
};
