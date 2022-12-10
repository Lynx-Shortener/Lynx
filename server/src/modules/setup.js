const {
	createAccount,
	countAccounts,
} = require("../db/modules/account");
require("dotenv").config();

module.exports = async () => {
	const accountCount = await countAccounts();
	if (accountCount == 0) {
		const [account, accountError] = await createAccount({
			username: "admin",
			password: "changeme123",
			email: "admin@example.com",
		});

		if (accountError) return console.log(accountError.message);

		console.log("Admin account created!");
	}
	return { setupCompleted: true };
};
