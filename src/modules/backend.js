const { CronJob } = require("cron");
const Link = require("../db/models/link");
const Account = require("../db/models/account");
const createSecret = require("../db/modules/secret/create");
const backup = require("./backup");

const removeDemoLinks = async () => {
    const oldLinkCount = await Link.count({
        creationDate: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (oldLinkCount === 0) return;

    await Link.deleteMany({
        creationDate: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
    });

    console.log(`Deleted ${oldLinkCount} old links due to demo instance.`);
};

const regenSecrets = async () => {
    const accounts = await Account.find();
    accounts.forEach(async (account) => {
        await createSecret(account);
    });
};

const oldLinkDeletionJob = new CronJob({
    cronTime: "0 * * * * *",
    onTick: () => {
        removeDemoLinks();
    },
    timeZone: "UTC",
});

const secretRegenJob = new CronJob({
    cronTime: "0 0 * * * *",
    onTick: () => {
        regenSecrets();
    },
    timeZone: "UTC",
});

module.exports.start = () => {
    console.log("Backend started!");
    if (process.env.DEMO === "true") {
        oldLinkDeletionJob.start();
        secretRegenJob.start();
    }

    if (process.env.BACKUP === "true" && process.env.BACKUP_SCHEDULE) {
        const backupJob = new CronJob({
            cronTime: process.env.BACKUP_SCHEDULE,
            onTick: () => {
                backup({ count: process.env.BACKUP_COUNT });
            },
            runOnInit: true,
            timeZone: "UTC",
        });

        backupJob.start();
    }
};
