const fs = require("fs");
const path = require("path");
const account = require("../db/modules/account");
const Account = require("../db/models/account");
const CreateSecret = require("../db/modules/secret/create");

module.exports = async () => {
    const accounts = await account.countAccounts();

    // Create demo account
    if (accounts === 0) {
        if (process.env.DEMO === "true") {
            const [demoAccount, error] = await account.createAccount({
                username: "demo",
                password: "demo",
                role: "owner",
                email: "demo@example.com",
            });
            if (error) {
                console.log("Couldn't create demo account:", error);
            }
            if (demoAccount) {
                CreateSecret(demoAccount);
                console.log("Created demo account!");
            }
        }
    } else {
        const owner = await Account.findOne({ role: "owner" });
        if (!owner) {
            const newOwner = await Account.findOneAndUpdate({}, { $set: { role: "owner" } });
            console.log(`Automatically promoted ${newOwner.username} to owner, as no owner previously existed.`);
        }

        await Account.updateMany({ allowAutomaticLogin: { $exists: false } }, { $set: { allowAutomaticLogin: false } });

        await Account.updateMany(
            { totp: { $exists: true } },
            [
                {
                    $set: {
                        twoFactorAuthentication: {
                            enabled: "$totp.enabled",
                            backupCodes: "$totp.backupCodes",
                            totp: {
                                secret: "$totp.secret",
                                verified: "$totp.enabled",
                            },
                        },
                    },
                },
                {
                    $unset: ["totp"],
                },
            ],
        );
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
