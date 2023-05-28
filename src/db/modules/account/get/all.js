const Account = require("../../../models/account");
const returnAccount = require("../../../../modules/returnAccount");

module.exports = async () => {
	const accounts = await Account.find();
	return accounts.map((account) => {
		return returnAccount(account);
	});
};
