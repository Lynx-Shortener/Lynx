const hashPassword = require("../../password/hash");
const returnAccount = require("../../../../modules/returnAccount");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async ({ account: accountID, password }) => {
    const hashedPassword = hashPassword(password);
    const account = await Account.findOneAndUpdate({ id: accountID }, { $set: { password: hashedPassword } }, {
        new: true,
    });
    if (!account) return [null, { code: 400, message: "Invalid account ID" }];

    const accountDetails = returnAccount(account);

    return [
        {
            message: "Password successfully updated",
            account: accountDetails,
        },
        null,
    ];
};
