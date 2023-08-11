const fs = require("fs");
const path = require("path");
const Account = require("../db/modules/account");
const CreateSecret = require("../db/modules/secret/create");

module.exports = async () => {
    const accounts = await Account.countAccounts();

    // Create demo account
    if (accounts === 0) {
        if (process.env.DEMO === "true") {
            const [account, error] = await Account.createAccount({
                username: "demo",
                password: "demo",
                role: "owner",
                email: "demo@example.com",
            });
            if (error) {
                console.log("Couldn't create demo account:", error);
            }
            if (account) {
                CreateSecret(account);
                console.log("Created demo account!");
            }
        }
    }

    // Remove tmp files

    fs.readdir(path.join("tmp", "uploads"), (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            fs.unlink(path.join(path.join("tmp", "uploads"), file), (unlinkErr) => {
                if (unlinkErr) throw unlinkErr;
            });
        });
    });

    return { setupCompleted: true };
};
