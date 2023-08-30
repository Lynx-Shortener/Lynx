const returnAccount = require("../../../../modules/returnAccount");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async ({ account: accountID, email }) => {
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) return [null, { code: 400, message: "You cannot have the same email as another user" }];

    const account = await Account.findOneAndUpdate({ id: accountID }, { $set: { email } }, {
        new: true,
    });
    if (!account) return [null, { code: 400, message: "Invalid account ID" }];

    const accountDetails = returnAccount(account);

    return [
        {
            message: "Email successfully updated",
            account: accountDetails,
        },
        null,
    ];
};
