const { createAccount, countAccounts } = require("../db/modules/account");
const fs = require("fs");
const path = require("path");
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

	// Remove tmp files

	fs.readdir(path.join("tmp", "uploads"), (err, files) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(path.join("tmp", "uploads"), file), (err) => {
				if (err) throw err;
			});
		}
	});

	return { setupCompleted: true };
};
