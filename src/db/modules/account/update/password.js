const checkPassword = require("../../password/check");
const hashPassword = require("../../password/hash");
const returnAccount = require("../../../../modules/returnAccount");
require("dotenv").config();

module.exports = async ({ account, password, newPassword }) => {
    const passwordMatches = await checkPassword(password, account.password);
    if (!passwordMatches) {
        return [
            null,
            {
                code: 400,
                message: "Invalid password",
            },
        ];
    }

    const hashedPassword = hashPassword(newPassword);
    account.password = hashedPassword;

    await account.save();

    const accountDetails = returnAccount(account);

    return [
        {
            message: "Password successfully updated",
            account: accountDetails,
        },
        null,
    ];
};
