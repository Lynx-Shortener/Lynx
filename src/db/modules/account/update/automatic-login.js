const returnAccount = require("../../../../modules/returnAccount");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async ({ account: accountID, value }) => {
    const account = await Account.findOneAndUpdate({ id: accountID }, { $set: { allowAutomaticLogin: !!value } }, {
        new: true,
    });
    if (!account) return [null, { code: 400, message: "Invalid account ID" }];

    const accountDetails = returnAccount(account);

    return [
        {
            message: "Account successfully updated",
            account: accountDetails,
        },
        null,
    ];
};
