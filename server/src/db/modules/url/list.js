const URL = require("../../models/url");

module.exports = async ({ pagesize, page }) => {
	const total = await URL.count();
	const urls = await URL.find({}, null, { skip: page * pagesize, limit: pagesize });

	let remaining = Math.ceil((total - page * pagesize) / pagesize) - 1;

	if (remaining < 0) remaining = 0;

	return {
		remaining,
		urls,
	};
};
