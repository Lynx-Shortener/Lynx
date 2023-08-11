const Account = require("../../models/account");

const generateSecret = async () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let secret;

    const generateUniqueSecret = async () => {
        secret = [...new Array(32)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");

        const existingAccount = await Account.findOne({ secret });
        if (existingAccount) {
            return generateUniqueSecret();
        }

        return secret;
    };

    return generateUniqueSecret();
};

module.exports = async (account) => {
    const secret = await generateSecret();

    account.secret = secret;
    account.save();

    return secret;
};
