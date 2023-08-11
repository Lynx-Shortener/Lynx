const Account = require("../../models/account");

module.exports = async () => Account.count();
