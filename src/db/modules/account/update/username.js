const returnAccount = require("../../../../modules/returnAccount");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async ({ account: accountID, username }) => {
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) return [null, { code: 400, message: "You cannot have the same username as another user" }];

    const account = await Account.findOneAndUpdate({ id: accountID }, { $set: { username } }, {
        new: true,
    });
    if (!account) return [null, { code: 400, message: "Invalid account ID" }];

    const accountDetails = returnAccount(account);

    return [
        {
            message: "Username successfully updated",
            account: accountDetails,
        },
        null,
    ];
};
