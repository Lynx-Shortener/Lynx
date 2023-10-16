const { v4: uuid4 } = require("uuid");
const Account = require("../../models/account");
const hashPassword = require("../password/hash");

module.exports = async ({
    username, email, password, role,
}) => {
    try {
        const account = new Account({
            id: uuid4(),
            username,
            email,
            role,
            secret: null,
            loginMethods: {
                password: hashPassword(password),
                webAuthn: false,
            },
            twoFactorAuthentication: {
                enabled: false,
                totp: {
                    secret: false,
                    backupCodes: [],
                    enabled: false,
                },
                webAuthn: {
                    lastChallenge: false,
                    authenticators: [],
                },
            },
        });

        await account.save();

        return [account, null];
    } catch (e) {
        console.log(e);
        return [null, true];
    }
};
