const Account = require("../../models/account");

module.exports = async () => Account.countDocuments();
