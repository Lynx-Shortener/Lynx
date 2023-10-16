const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: String,
    username: String,
    email: String,
    role: String, // owner || admin || standard
    secret: String,
    loginMethods: {
        password: String,
        webAuthn: Boolean,
    },
    twoFactorAuthentication: {
        enabled: Boolean,
        totp: {
            secret: String,
            backupCodes: [String],
            enabled: Boolean,
        },
        webAuthn: {
            lastChallenge: String,
            authenticators: [
                {
                    id: Buffer,
                    credentialPublicKey: Buffer,
                    counter: Number,
                    name: String,
                },
            ],
        },
    },
});

const Account = mongoose.model("Account", schema);

module.exports = Account;
