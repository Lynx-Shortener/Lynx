const Account = require("../../../models/account");

module.exports = async ({ secret }) => {
    const account = await Account.findOne({ secret });
    if (account) return [account, null];

    return [null, { code: 401, message: "Invalid secret" }];
};
