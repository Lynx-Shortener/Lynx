const Account = require("../../../models/account");

module.exports = async ({ id }) => {
    const account = await Account.findOne({ id });
    if (account) return [account, null];

    return [null, { code: 401, message: "Invalid id" }];
};
