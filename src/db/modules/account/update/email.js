const checkPassword = require("../../password/check");
const returnAccount = require("../../../../modules/returnAccount");
require("dotenv").config();

module.exports = async ({ account, newEmail, password }) => {
	const passwordMatches = await checkPassword(password, account.password);
	if (!passwordMatches)
		return [
			null,
			{
				code: 400,
				message: "Invalid password",
			},
		];

	account.email = newEmail;
	await account.save();

	const accountDetails = returnAccount(account);

	return [
		{
			message: "Email successfully updated",
			account: accountDetails,
		},
		null,
	];
};
