var CronJob = require("cron").CronJob;
const Link = require("../db/models/link");

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

const task = () => {
	if (process.env.DEMO === "true") removeDemoLinks();
};

const job = new CronJob({
	cronTime: "0 * * * * *",
	onTick: task,
	runOnInit: true,
	timeZone: "UTC",
});

module.exports.start = () => {
	console.log("Backend started!");
	job.start();
};
