const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    role: String, // owner || admin || standard
    secret: String,
    totp: {
        enabled: Boolean,
        secret: String,
        backupCodes: [String],
    },
    quota: {
        links: {
            used: Number, // -1 = unlimited, null = default
            limit: Number,
        },
    },
});

const Account = mongoose.model("Account", schema);

module.exports = Account;
