const checkPassword = require("../../password/check");
require("dotenv").config();

module.exports = async ({ account, newUsername, password }) => {
	const passwordMatches = await checkPassword(password, account.password);
	if (!passwordMatches)
		return [
			null,
			{
				code: 400,
				message: "Invalid password",
			},
		];

	account.username = newUsername;
	await account.save();

	const {
		email,
		id,
		username,
		totp: { enabled: totp },
		secret,
	} = account;

	return [
		{
			message: "Username successfully updated",
			account: {
				email,
				id,
				username,
				totp,
				secret,
			},
		},
		null,
	];
};
