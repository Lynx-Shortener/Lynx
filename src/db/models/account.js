const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    role: String, // owner || admin || standard
    secret: String,
    passwordless: Boolean,
    totp: {
        enabled: Boolean,
        secret: String,
        backupCodes: [String],
    },
    webauthn: {
        lastChallenge: String,
        authenticators: [
            {
                id: Buffer,
                publicKey: Buffer,
                counter: Number,
                name: String,
            },
        ],
    },
});

const Account = mongoose.model("Account", schema);

module.exports = Account;
