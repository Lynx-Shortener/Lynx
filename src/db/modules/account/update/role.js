const returnAccount = require("../../../../modules/returnAccount");
require("dotenv").config();

module.exports = async ({ account, role }) => {
    account.role = role;
    await account.save();

    const accountDetails = returnAccount(account);

    return [
        accountDetails,
        null,
    ];
};
