const Account = require("../../models/account");

module.exports = async () => {
	return await Account.count();
};
