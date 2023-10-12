const fs = require("fs");
const path = require("path");
const account = require("../db/modules/account");
const Account = require("../db/models/account");
const CreateSecret = require("../db/modules/secret/create");
const Link = require("../db/models/link");

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
        //
        // Migration
        //

        const owner = await Account.findOne({ role: "owner" });
        if (!owner) {
            const newOwner = await Account.findOneAndUpdate({}, { $set: { role: "owner" } });
            console.log(`Automatically promoted ${newOwner.username} to owner, as no owner previously existed.`);
        }

        // Set user quotas to default if undefined
        const defaultLinkQuota = Number(process.env.DEFAULT_USER_LINK_QUOTA || -1);
        if (defaultLinkQuota) {
            const accountsWithoutQuota = await Account.find({ quota: { $exists: 0 } });
            const accountsWithoutQuotaWrites = await Promise.all(accountsWithoutQuota.map(async (accountWithoutQuota) => {
                const usedLinks = await Link.countDocuments({ author: accountWithoutQuota.id });
                return {
                    updateOne: {
                        filter: { id: accountWithoutQuota.id },
                        update: {
                            $set: {
                                "quota.links.used": usedLinks,
                                "quota.links.limit": defaultLinkQuota,
                            },
                        },
                    },
                };
            }));

            await Account.bulkWrite(accountsWithoutQuotaWrites);
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
