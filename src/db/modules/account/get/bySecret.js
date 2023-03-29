const Account = require("../../../models/account");

module.exports = async ({ secret }) => {
	const account = await Account.findOne({ secret });
	return [account, !account];
};
