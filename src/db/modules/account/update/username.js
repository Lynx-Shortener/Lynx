const checkPassword = require("../../password/check");
const returnAccount = require("../../../../modules/returnAccount");
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

	const accountDetails = returnAccount(account);

	return [
		{
			message: "Username successfully updated",
			account: accountDetails,
		},
		null,
	];
};
